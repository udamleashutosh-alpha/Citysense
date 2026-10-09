
import React, { useMemo, useState } from "react";
import "./DecisionEngine.css";

// Demo records only. Replace these with your real CITYSENSE place records.
const DEMO_PLACES = [
  { id: "p1", name: "Shaniwar Wada", category: "Heritage", area: "Pune",
    budget: 50, distanceKm: 3.2, rating: 4.5, cleanliness: 3.8,
    stepFree: false, safetyInfoCount: 2, description: "Historic landmark" },
  { id: "p2", name: "Aga Khan Palace", category: "Heritage", area: "Pune",
    budget: 100, distanceKm: 7.1, rating: 4.6, cleanliness: 4.2,
    stepFree: true, safetyInfoCount: 2, description: "Museum and heritage site" },
  { id: "p3", name: "Osho Teerth Park", category: "Park", area: "Koregaon Park",
    budget: 30, distanceKm: 5.4, rating: 4.3, cleanliness: 4.1,
    stepFree: true, safetyInfoCount: 1, description: "Green space for a quiet walk" },
  { id: "p4", name: "Sinhagad Fort", category: "Outdoors", area: "Pune district",
    budget: 150, distanceKm: 24, rating: 4.7, cleanliness: 3.7,
    stepFree: false, safetyInfoCount: 1, description: "Hill fort and outdoor visit" },
  { id: "p5", name: "Saras Baug", category: "Park", area: "Pune",
    budget: 20, distanceKm: 4.1, rating: 4.2, cleanliness: 3.9,
    stepFree: true, safetyInfoCount: 1, description: "Garden and recreation" },
  { id: "p6", name: "Local Cafe", category: "Food", area: "Pune",
    budget: 250, distanceKm: 1.8, rating: 4.1, cleanliness: 4.0,
    stepFree: true, safetyInfoCount: 0, description: "Demo food option" },
  { id: "p7", name: "City Shopping Area", category: "Shopping", area: "Pune",
    budget: 400, distanceKm: 2.6, rating: 4.0, cleanliness: 3.7,
    stepFree: null, safetyInfoCount: 0, description: "Demo shopping option" },
  { id: "p8", name: "Dagdusheth Temple", category: "Heritage", area: "Pune",
    budget: 0, distanceKm: 3.0, rating: 4.6, cleanliness: 3.8,
    stepFree: null, safetyInfoCount: 1, description: "Religious and cultural landmark" }
];

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function numberFrom(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const match = value.replace(/,/g, "").match(/\d+(\.\d+)?/);
    if (match) return Number(match[0]);
  }
  return null;
}

function normalizePlace(place, index) {
  const name = place.name ?? place.title ?? place.placeName ?? `Place ${index + 1}`;
  const category = place.category ?? place.type ?? place.kind ?? "Other";

  let budget = numberFrom(
    place.budget ?? place.estimatedCost ?? place.price ?? place.cost
  );

  // If the source has a budget label instead of a number, don't invent a price.
  if (budget === null) {
    const label = String(place.budget ?? place.priceRange ?? "").toLowerCase();
    if (label.includes("free")) budget = 0;
    else if (label.includes("low") || label.includes("cheap")) budget = 100;
    else if (label.includes("medium") || label.includes("moderate")) budget = 300;
    else if (label.includes("high") || label.includes("premium")) budget = 800;
  }

  let distanceKm = numberFrom(place.distanceKm ?? place.distance_km);
  if (distanceKm === null) {
    const distance = numberFrom(place.distance);
    const unit = String(place.distanceUnit ?? "").toLowerCase();
    if (distance !== null && unit.includes("km")) distanceKm = distance;
    else if (distance !== null && unit.includes("m")) distanceKm = distance / 1000;
  }

  const rating = numberFrom(place.rating ?? place.averageRating);
  const cleanliness = numberFrom(place.cleanliness ?? place.cleanlinessScore);

  const accessValue = place.stepFree ?? place.isAccessible ?? place.accessible;
  const stepFree =
    typeof accessValue === "boolean"
      ? accessValue
      : typeof accessValue === "string"
        ? /^(yes|true|accessible|step.free)$/i.test(accessValue)
          ? true
          : /^(no|false|inaccessible|not accessible)$/i.test(accessValue)
            ? false
            : null
        : null;

  const rawSafetyInfo =
    place.safetyInfoCount ??
    place.safetyReportsCount ??
    place.safetyInformationCount;
  const safetyInfoCount =
    numberFrom(rawSafetyInfo) ??
    (Array.isArray(place.safetyReports) ? place.safetyReports.length : null);

  return {
    id: String(place.id ?? place._id ?? place.slug ?? `${name}-${index}`),
    name: String(name),
    category: String(category),
    area: String(place.area ?? place.neighborhood ?? place.address ?? ""),
    description: String(place.description ?? place.summary ?? ""),
    budget,
    distanceKm,
    rating: rating === null ? null : clamp(rating, 0, 5),
    cleanliness: cleanliness === null ? null : clamp(cleanliness, 0, 5),
    stepFree,
    // This is information coverage, not a measure of actual safety.
    safetyInfoCount
  };
}

function fitLowerIsBetter(value, limit) {
  if (value === null || value === undefined) return 0.5;
  if (value <= limit) return 1;
  return clamp(1 - (value - limit) / Math.max(limit, 1), 0, 1);
}

function fitRating(value) {
  return value === null ? 0.5 : clamp(value / 5, 0, 1);
}

function scorePlace(place, preferences) {
  const costFit = fitLowerIsBetter(place.budget, preferences.budget);
  const distanceFit = fitLowerIsBetter(place.distanceKm, preferences.distance);
  const ratingFit = fitRating(place.rating);
  const cleanlinessFit = fitRating(place.cleanliness);

  const accessFit =
    place.stepFree === null ? 0.5 : place.stepFree ? 1 : 0;

  // More documented information does NOT mean a place is safer.
  const informationFit =
    place.safetyInfoCount === null
      ? 0.5
      : clamp(place.safetyInfoCount / 3, 0, 1);

  let weights = {
    budget: 0.24,
    distance: 0.22,
    rating: 0.2,
    cleanliness: 0.14,
    accessibility: 0.12,
    information: 0.08
  };

  if (preferences.priority === "budget") {
    weights = { ...weights, budget: 0.42, distance: 0.22, rating: 0.14,
      cleanliness: 0.08, accessibility: 0.08, information: 0.06 };
  } else if (preferences.priority === "quality") {
    weights = { ...weights, budget: 0.12, distance: 0.12, rating: 0.32,
      cleanliness: 0.22, accessibility: 0.12, information: 0.08 };
  } else if (preferences.priority === "access") {
    weights = { ...weights, budget: 0.12, distance: 0.14, rating: 0.14,
      cleanliness: 0.12, accessibility: 0.38, information: 0.08 };
  }

  // Missing values stay neutral and are disclosed in the explanation.
  const score = (
    costFit * weights.budget +
    distanceFit * weights.distance +
    ratingFit * weights.rating +
    cleanlinessFit * weights.cleanliness +
    accessFit * weights.accessibility +
    informationFit * weights.information
  ) * 100;

  const factors = [
    { label: "Budget fit", value: costFit, weight: weights.budget },
    { label: "Distance fit", value: distanceFit, weight: weights.distance },
    { label: "Rating", value: ratingFit, weight: weights.rating },
    { label: "Cleanliness data", value: cleanlinessFit, weight: weights.cleanliness },
    { label: "Step-free access", value: accessFit, weight: weights.accessibility },
    { label: "Safety information coverage", value: informationFit, weight: weights.information }
  ];

  const sortedFactors = [...factors].sort(
    (a, b) => (b.value * b.weight) - (a.value * a.weight)
  );

  const reasons = [];
  if (costFit >= 0.8) reasons.push("fits your budget");
  if (distanceFit >= 0.8) reasons.push("within your preferred travel range");
  if (place.rating !== null && place.rating >= 4.3) reasons.push("has a strong demo rating");
  if (preferences.stepFreeRequired && place.stepFree === true) {
    reasons.push("has step-free access recorded");
  }

  const cautions = [];
  if (place.budget === null) cautions.push("cost not provided");
  if (place.distanceKm === null) cautions.push("distance not provided");
  if (place.rating === null) cautions.push("rating not provided");
  if (place.cleanliness === null) cautions.push("cleanliness data not provided");
  if (place.stepFree === null) cautions.push("accessibility not verified");
  if (place.safetyInfoCount === null) cautions.push("safety-information coverage unknown");
  else if (place.safetyInfoCount === 0) cautions.push("no safety information recorded");

  return { ...place, score, reasons, cautions, factors: sortedFactors };
}

export default function DecisionEngine({
  places: incomingPlaces = [],
  onSelectPlace
}) {
  const [budget, setBudget] = useState(300);
  const [distance, setDistance] = useState(8);
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("balanced");
  const [stepFreeRequired, setStepFreeRequired] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const usingDemoData = !Array.isArray(incomingPlaces) || incomingPlaces.length === 0;

  const places = useMemo(
    () => (usingDemoData ? DEMO_PLACES : incomingPlaces)
      .map(normalizePlace),
    [incomingPlaces, usingDemoData]
  );

  const categories = useMemo(
    () => ["All", ...new Set(places.map((p) => p.category).filter(Boolean))],
    [places]
  );

  const rankedPlaces = useMemo(() => {
    const preferences = { budget, distance, priority, stepFreeRequired };

    return places
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => !stepFreeRequired || p.stepFree === true)
      .map((p) => scorePlace(p, preferences))
      .sort((a, b) => b.score - a.score);
  }, [places, budget, distance, category, priority, stepFreeRequired]);

  const topThree = rankedPlaces.slice(0, 3);
  const selected = rankedPlaces.find((p) => p.id === selectedId) ?? topThree[0] ?? null;

  function selectPlace(place) {
    setSelectedId(place.id);
    if (onSelectPlace) onSelectPlace(place);
  }

  return (
    <section className="cs-engine">
      <div className="cs-engine-head">
        <div>
          <div className="cs-eyebrow">CITYSENSE / INTELLIGENCE</div>
          <h2>Decision Engine</h2>
          <p>Find the option that best fits your needs—not just the highest-rated place.</p>
        </div>
        <div className="cs-engine-live"><span /> LIVE CALCULATION</div>
      </div>

      {usingDemoData && (
        <div className="cs-demo-notice">
          DEMO DATA — example values are illustrative, not verified live conditions.
        </div>
      )}

      <div className="cs-engine-layout">
        <aside className="cs-preferences">
          <div className="cs-panel-title">YOUR PREFERENCES</div>

          <label className="cs-control-label">
            <span>Maximum spend per person</span>
            <strong>₹{budget}</strong>
          </label>
          <input
            className="cs-range"
            type="range"
            min="0"
            max="2000"
            step="50"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            aria-label="Maximum spend per person"
          />
          <div className="cs-range-labels"><span>Free</span><span>₹2,000+</span></div>

          <label className="cs-control-label">
            <span>Preferred travel distance</span>
            <strong>{distance} km</strong>
          </label>
          <input
            className="cs-range"
            type="range"
            min="1"
            max="30"
            step="1"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            aria-label="Preferred travel distance in kilometres"
          />
          <div className="cs-range-labels"><span>Nearby</span><span>30 km</span></div>

          <label className="cs-control-label" htmlFor="cs-category">
            Type of place
          </label>
          <select
            id="cs-category"
            className="cs-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>

          <label className="cs-control-label" htmlFor="cs-priority">
            What matters most?
          </label>
          <select
            id="cs-priority"
            className="cs-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="balanced">Best balance</option>
            <option value="budget">Save money</option>
            <option value="quality">Rating and quality data</option>
            <option value="access">Step-free accessibility</option>
          </select>

          <label className="cs-access-option">
            <input
              type="checkbox"
              checked={stepFreeRequired}
              onChange={(e) => setStepFreeRequired(e.target.checked)}
            />
            <span>
              <strong>Require step-free access</strong>
              <small>Only include places explicitly marked as step-free.</small>
            </span>
          </label>

          <button
            type="button"
            className="cs-reset"
            onClick={() => {
              setBudget(300);
              setDistance(8);
              setCategory("All");
              setPriority("balanced");
              setStepFreeRequired(false);
              setSelectedId(null);
            }}
          >
            Reset preferences
          </button>
        </aside>

        <div className="cs-results">
          <div className="cs-results-heading">
            <div>
              <div className="cs-panel-title">YOUR BEST MATCHES</div>
              <p>{rankedPlaces.length} options ranked against your preferences</p>
            </div>
            <span className="cs-rank-note">Weighted scoring</span>
          </div>

          {rankedPlaces.length === 0 ? (
            <div className="cs-empty">
              <h3>No matching options</h3>
              <p>Try a different category or turn off the step-free requirement.</p>
            </div>
          ) : (
            <div className="cs-result-list">
              {rankedPlaces.slice(0, 6).map((place, index) => (
                <button
                  type="button"
                  key={place.id}
                  className={`cs-result-card ${selected?.id === place.id ? "is-selected" : ""}`}
                  onClick={() => selectPlace(place)}
                  aria-pressed={selected?.id === place.id}
                >
                  <span className="cs-rank">0{index + 1}</span>
                  <span className="cs-result-main">
                    <strong>{place.name}</strong>
                    <small>{place.category}{place.area ? ` · ${place.area}` : ""}</small>
                    <span className="cs-mini-facts">
                      {place.budget === null ? "Cost unknown" : place.budget === 0 ? "Free (recorded)" : `~₹${place.budget}`}
                      {" · "}
                      {place.distanceKm === null ? "Distance unknown" : `${place.distanceKm} km`}
                      {" · "}
                      {place.rating === null ? "No rating" : `${place.rating.toFixed(1)} / 5 demo rating`}
                    </span>
                  </span>
                  <span className="cs-score">
                    <strong>{Math.round(place.score)}</strong>
                    <small>FIT / 100</small>
                  </span>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className="cs-explanation">
              <div className="cs-explanation-top">
                <div>
                  <div className="cs-panel-title">WHY THIS MATCH?</div>
                  <h3>{selected.name}</h3>
                  <p>{selected.description || "No description supplied."}</p>
                </div>
                <div className="cs-big-score">
                  <strong>{Math.round(selected.score)}</strong>
                  <span>/100 fit</span>
                </div>
              </div>

              <div className="cs-reasons">
                {selected.reasons.length > 0
                  ? selected.reasons.map((reason) => (
                    <span className="cs-reason" key={reason}>+ {reason}</span>
                  ))
                  : <span className="cs-reason">Ranking reflects the available data and your selected weights.</span>}
              </div>

              <div className="cs-factor-list">
                {selected.factors.map((factor) => (
                  <div className="cs-factor" key={factor.label}>
                    <span>{factor.label}</span>
                    <div className="cs-factor-track">
                      <span style={{ width: `${Math.round(factor.value * 100)}%` }} />
                    </div>
                    <strong>{Math.round(factor.value * 100)}%</strong>
                  </div>
                ))}
              </div>

              {selected.cautions.length > 0 && (
                <div className="cs-cautions">
                  <strong>Data gaps to check</strong>
                  <p>{selected.cautions.join(" · ")}</p>
                </div>
              )}

              <div className="cs-disclaimer">
                Fit score = preference match, not a guarantee of quality or safety.
                Ratings, costs, accessibility and information coverage may be missing,
                approximate or demo values. Verify important details before travelling.
              </div>

              {onSelectPlace && (
                <button
                  type="button"
                  className="cs-open-place"
                  onClick={() => onSelectPlace(selected)}
                >
                  Open this place in CITYSENSE →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="cs-engine-footer">
        <span>METHOD: weighted multi-criteria ranking</span>
        <span>Preference changes recalculate results instantly</span>
      </div>
    </section>
  );
}
