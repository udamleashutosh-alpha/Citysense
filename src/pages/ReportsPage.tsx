import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import type { IncidentCategory } from '@/types';
import SectionHeader from '@/components/SectionHeader';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import { timeAgo } from '@/utils/format';
import {
  FileText,
  Send,
  Image as ImageIcon,
  Mic,
  Square,
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';

const categories: IncidentCategory[] = [
  'Theft',
  'Harassment',
  'Road Safety',
  'Public Nuisance',
  'Lighting Issue',
  'Other',
];

export default function ReportsPage() {
  const { reports, addReport, setPage } = useApp();

  const [category, setCategory] = useState<IncidentCategory>('Road Safety');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string>('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [voiceNoteName, setVoiceNoteName] = useState<string>('');
  const [voiceError, setVoiceError] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) {
      newErrors.description = 'Please describe what happened.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }
    if (!location.trim()) {
      newErrors.location = 'Please provide a location (area or landmark).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addReport({
      category,
      description: description.trim(),
      location: location.trim(),
      source: 'community',
      imageDataUrl,
      hasVoiceNote,
      voiceNoteName: hasVoiceNote ? voiceNoteName : undefined,
    });

    // Reset form
    setDescription('');
    setLocation('');
    setImageDataUrl(undefined);
    setFileName('');
    setHasVoiceNote(false);
    setVoiceNoteName('');
    setErrors({});
    setSuccess(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image must be under 2 MB.' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setFileName(file.name);
      setErrors((prev) => {
        const { image, ...rest } = prev;
        return rest;
      });
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    setVoiceError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // We store a flag rather than the blob itself (localStorage quota)
        const timestamp = new Date().toLocaleString('en-IN');
        setHasVoiceNote(true);
        setVoiceNoteName(`Voice note (${timestamp})`);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setVoiceError(
        'Microphone access is not available. Please check browser permissions.'
      );
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const clearVoiceNote = () => {
    setHasVoiceNote(false);
    setVoiceNoteName('');
  };

  const clearImage = () => {
    setImageDataUrl(undefined);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Community Reports"
        subtitle="Submit a local safety or civic observation. Reports are stored in your browser only."
        icon={<FileText size={28} />}
      />

      {/* Important notice */}
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
        <Info size={20} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          <strong>Local submissions only.</strong> Your report is saved in your browser's
          local storage and is <strong>not sent to authorities</strong>. New reports start
          as <em>Unverified</em>. Use official channels for emergencies (call 112).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl bg-sand-50 p-5 shadow-sm ring-1 ring-navy-100/60 sm:p-6"
          >
            <h3 className="font-display text-lg font-semibold text-navy-800">
              New Report
            </h3>

            {success && (
              <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 ring-1 ring-green-200 animate-scale-in">
                <CheckCircle2 size={20} className="text-green-600" />
                <p className="text-sm text-green-800">
                  Report submitted successfully! It is now visible below and on the Safety page.
                </p>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-navy-700">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`chip ${
                      category === cat ? 'chip-active' : 'chip-inactive'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-navy-700"
              >
                What happened? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the incident or observation in detail..."
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy-800 outline-none transition-all focus:ring-2 ${
                  errors.description
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                    : 'border-navy-200 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-1.5 block text-sm font-medium text-navy-700"
              >
                Approximate location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. FC Road, near college gate"
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-navy-800 outline-none transition-all focus:ring-2 ${
                  errors.location
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                    : 'border-navy-200 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-xs text-red-600">{errors.location}</p>
              )}
              <p className="mt-1 text-xs text-navy-400">
                Use an approximate area, not an exact address.
              </p>
            </div>

            {/* Image upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-700">
                Attach image (optional)
              </label>
              {imageDataUrl ? (
                <div className="relative inline-block">
                  <img
                    src={imageDataUrl}
                    alt="Attachment preview"
                    className="max-h-32 rounded-lg ring-1 ring-navy-100"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-navy-200 px-4 py-3 text-sm text-navy-400 transition-colors hover:border-teal-400 hover:text-teal-600"
                  >
                    <ImageIcon size={20} />
                    {fileName || 'Click to upload (max 2 MB)'}
                  </label>
                  {errors.image && (
                    <p className="mt-1 text-xs text-red-600">{errors.image}</p>
                  )}
                </>
              )}
            </div>

            {/* Voice note */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-700">
                Voice note (optional)
              </label>
              {!hasVoiceNote ? (
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-600 transition-colors hover:border-teal-400 hover:text-teal-600"
                    >
                      <Mic size={18} />
                      Start recording
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                    >
                      <Square size={16} className="fill-white" />
                      Stop recording
                    </button>
                  )}
                  {isRecording && (
                    <span className="flex items-center gap-2 text-sm text-red-600">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                      Recording...
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-teal-50 px-4 py-2.5 ring-1 ring-teal-200">
                  <Mic size={18} className="text-teal-600" />
                  <span className="text-sm text-teal-700">{voiceNoteName}</span>
                  <button
                    type="button"
                    onClick={clearVoiceNote}
                    className="ml-auto rounded-lg p-1 text-teal-400 transition-colors hover:text-red-500"
                    aria-label="Remove voice note"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {voiceError && (
                <p className="mt-1 text-xs text-red-600">{voiceError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <Send size={16} />
              Submit Report
            </button>
          </form>
        </div>

        {/* Recent reports sidebar */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-sand-50 p-5 shadow-sm ring-1 ring-navy-100/60">
            <h3 className="mb-4 font-display text-lg font-semibold text-navy-800">
              Your Submitted Reports ({reports.length})
            </h3>
            {reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-xl bg-navy-50/60 p-3 ring-1 ring-navy-100/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-navy-700">
                        {report.category}
                      </span>
                      <Badge variant="error">Unverified</Badge>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-navy-600">
                      {report.description}
                    </p>
                    <p className="mt-2 text-xs text-navy-400">
                      {report.location} · {timeAgo(report.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <AlertTriangle
                  size={32}
                  className="mx-auto mb-3 text-navy-200"
                />
                <p className="text-sm text-navy-400">
                  No reports submitted yet. Fill the form to add your first observation.
                </p>
              </div>
            )}

            <button
              onClick={() => setPage('safety')}
              className="btn-ghost mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
            >
              View all safety reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
