import type { HeritageLandmark } from '@/types';

export const heritageLandmarks: HeritageLandmark[] = [
  {
    id: 'h-shaniwar-wada',
    name: 'Shaniwar Wada',
    yearBuilt: '1732',
    era: 'Maratha Empire \u2014 Peshwa Era',
    lat: 18.5196,
    lng: 73.8553,
    summary:
      'The ceremonial seat of the Peshwas of the Maratha Empire, destroyed by fire in 1828 and preserved as an ASI-protected monument.',
    history:
      'Shaniwar Wada was commissioned by Peshwa Baji Rao I in 1730 and completed in 1732. It served as the political capital of the Maratha Empire under the Peshwas. The complex originally spanned 6.25 acres with five gates, nine bastions, and a seven-storey palace. On February 27, 1828, a mysterious fire raged for a fortnight, destroying almost all wooden structures. The stone gates and outer walls survived and now stand as the most iconic heritage monument of Pune. The Delhi Gate (Delhi Darwaza) features carved stone arches 30 feet high. A daily light-and-sound show dramatizes Peshwa history.',
    timeline: [
      { year: '1730', event: 'Foundation laid by Peshwa Baji Rao I' },
      { year: '1732', event: 'Construction completed; becomes Peshwa seat' },
      { year: '1761', event: 'Panipat aftermath \u2014 Maratha power wanes' },
      { year: '1818', event: 'British East India Company takes control after Anglo-Maratha wars' },
      { year: '1828', event: 'Destructive fire destroys the interior palaces' },
      { year: '1947+', event: 'ASI takes over; heritage monument protected' },
    ],
    furtherReading: [
      { label: 'Wikipedia \u2014 Shaniwar Wada', url: 'https://en.wikipedia.org/wiki/Shaniwar_Wada' },
      { label: 'ASI \u2014 Protected Monuments (Maharashtra)', url: 'https://asi.nic.in/' },
    ],
    imageQuery: 'Shaniwar Wada fort Pune historic gate',
  },
  {
    id: 'h-aga-khan',
    name: 'Aga Khan Palace',
    yearBuilt: '1892',
    era: 'British Colonial \u2014 Independence Movement',
    lat: 18.5504,
    lng: 73.9073,
    summary:
      'Built by Sultan Aga Khan III, later a prison for Mahatma Gandhi and a memorial to Kasturba Gandhi.',
    history:
      'Sultan Mahomed Shah Aga Khan III built the palace in 1892 as an act of charity to provide employment during a famine in the Pune region. The palace spans 19 acres and features Italian-style arches and spacious lawns. During the Quit India Movement of 1942 the British interned Mahatma Gandhi, Kasturba Gandhi, Mahadev Desai, and others here. Mahadev Desai died in 1942 and Kasturba Gandhi in 1944 \u2014 their samadhis are on the grounds. In 1969, Aga Khan IV donated the palace to the Gandhi National Memorial Society. It is now a monument of national importance.',
    timeline: [
      { year: '1892', event: 'Built by Aga Khan III as famine relief' },
      { year: '1942', event: 'Gandhi and Kasturba imprisoned here during Quit India' },
      { year: '1942', event: 'Mahadev Desai dies at the palace' },
      { year: '1944', event: 'Kasturba Gandhi passes away here' },
      { year: '1969', event: 'Donated to Gandhi National Memorial Society' },
      { year: '2003+', event: 'Declared monument of national importance' },
    ],
    furtherReading: [
      { label: 'Wikipedia \u2014 Aga Khan Palace', url: 'https://en.wikipedia.org/wiki/Aga_Khan_Palace' },
      { label: 'Gandhi Memorial Society', url: 'https://en.wikipedia.org/wiki/Gandhi_National_Memorial_Society' },
    ],
    imageQuery: 'Aga Khan Palace Pune colonial architecture',
  },
  {
    id: 'h-parvati',
    name: 'Parvati Hill Temple Complex',
    yearBuilt: '1749',
    era: 'Maratha Empire \u2014 Peshwa Era',
    lat: 18.4817,
    lng: 73.8467,
    summary:
      'Pune\u2019s highest vantage point, with a 103-step climb to temples built by Peshwa Balaji Baji Rao.',
    history:
      'Parvati Hill rises to 640 m above sea level, making it the highest point in Pune. The temple complex was built by Peshwa Balaji Baji Rao (Nanasaheb) starting in 1749. A flight of 103 steps carved into the hill leads to five temples: Devdeveshwar (Parvati-Shiva), Vishnu, Ganesh, Kartikeya, and Vithoba-Rukmini. The Peshwa Balaji Baji Rao is said to have built it to fulfill a vow. The complex also houses a museum with Peshwa-era weapons, manuscripts, and paintings. The panoramic view of Pune, especially at sunset, draws hundreds of visitors daily.',
    timeline: [
      { year: '1749', event: 'Construction begins under Peshwa Balaji Baji Rao' },
      { year: '18th century', event: 'Five temples completed; becomes a pilgrimage site' },
      { year: '1818', event: 'British takeover; complex preserved' },
      { year: '20th century', event: 'Peshwa museum established on site' },
    ],
    furtherReading: [
      { label: 'Wikipedia \u2014 Parvati Hill', url: 'https://en.wikipedia.org/wiki/Parvati_Hill' },
      { label: 'Pune Municipal Corporation Heritage', url: 'https://pmc.gov.in/' },
    ],
    imageQuery: 'Parvati hill temple Pune steps sunset',
  },
  {
    id: 'h-lal-mahal',
    name: 'Lal Mahal',
    yearBuilt: '1640 (restored 20th c.)',
    era: 'Maratha Empire \u2014 Chhatrapati Shivaji Era',
    lat: 18.5191,
    lng: 73.8585,
    summary:
      'The red palace where Chhatrapati Shivaji grew up, rebuilt as a memorial in modern times.',
    history:
      'The original Lal Mahal was built in 1640 by Dadoji Konddeo, the guardian of young Shivaji, as a residence for Shivaji and his mother Jijabai. The structure was of red brick \u2014 hence the name. It was here that Shivaji famously attacked Shaista Khan in 1663, cutting off his fingers. The original building fell to ruin. The Pune Municipal Corporation reconstructed the current building in the 20th century. It now features oil paintings of Shivaji\u2019s life, statues of Shivaji and Jijabai, and a memorial pillar. It is located next to Shaniwar Wada.',
    timeline: [
      { year: '1640', event: 'Original Lal Mahal built for Shivaji and Jijabai' },
      { year: '1663', event: 'Shivaji\u2019s surprise attack on Shaista Khan' },
      { year: '18th\u201319th c.', event: 'Original structure falls to ruin' },
      { year: '1980s', event: 'Reconstructed by Pune Municipal Corporation' },
    ],
    furtherReading: [
      { label: 'Wikipedia \u2014 Lal Mahal', url: 'https://en.wikipedia.org/wiki/Lal_Mahal' },
      { label: 'Shivaji \u2014 Biography', url: 'https://en.wikipedia.org/wiki/Shivaji' },
    ],
    imageQuery: 'red palace Lal Mahal Pune',
  },
  {
    id: 'h-kelkar',
    name: 'Raja Dinkar Kelkar Museum',
    yearBuilt: '1962',
    era: 'Modern \u2014 Post-Independence',
    lat: 18.5157,
    lng: 73.8466,
    summary:
      'Personal collection of over 20,000 Indian artefacts, founded by Dr. D.G. Kelkar in memory of his son.',
    history:
      'Dr. Dinkar G. Kelkar began collecting everyday Indian art \u2014 carved doors, lamps, toys, musical instruments, and textiles \u2014 in the 1920s. He formally established the museum in 1962 in memory of his only son Raja, who had died young. The collection grew to over 20,000 artefacts spanning the 17th to 19th centuries. In 1962, Dr. Kelkar donated the entire collection to the Government of Maharashtra. The museum\u2019s centerpiece is a recreated Mastani Mahal with original furnishings \u2014 evoking the court of Peshwa Baji Rao and Mastani.',
    timeline: [
      { year: '1920s', event: 'Dr. D.G. Kelkar begins collecting artefacts' },
      { year: '1962', event: 'Museum formally established; donated to Maharashtra government' },
      { year: '1970s+', event: 'Mastani Mahal recreated within museum' },
      { year: 'Present', event: 'Continues to preserve and exhibit folk and decorative art' },
    ],
    furtherReading: [
      { label: 'Wikipedia \u2014 Raja Dinkar Kelkar Museum', url: 'https://en.wikipedia.org/wiki/Raja_Dinkar_Kelkar_Museum' },
      { label: 'Mastani \u2014 Historical Context', url: 'https://en.wikipedia.org/wiki/Mastani' },
    ],
    imageQuery: 'museum indian artifacts decorative art',
  },
  {
    id: 'h-pataleshwar',
    name: 'Pataleshwar Cave Temple',
    yearBuilt: '8th century',
    era: 'Rashtrakuta / Medieval',
    lat: 18.5279,
    lng: 73.8367,
    summary:
      'Rock-cut Shiva temple carved from a single basalt outcrop, predating the Peshwa era by centuries.',
    history:
      'The Pataleshwar Cave Temple, located on Jangli Maharaj Road, is an 8th-century rock-cut Shiva temple carved out of a single basalt rock. It is attributed to the Rashtrakuta period and features a circular Nandi mandapa supported by massive pillars, a sanctum with a Shiva linga, and carved panels. The temple is underground (Patal = nether world) and much older than Pune\u2019s Maratha-era heritage. An adjacent museum displays artefacts found on site. It is an ASI-protected monument of national importance.',
    timeline: [
      { year: '8th c.', event: 'Rock-cut cave temple carved during Rashtrakuta period' },
      { year: 'British era', event: 'Documented by colonial surveyors' },
      { year: '1947+', event: 'ASI takes over maintenance and protection' },
      { year: 'Present', event: 'Small museum added adjacent to caves' },
    ],
    furtherReading: [
      { label: 'Wikipedia \u2014 Pataleshwar', url: 'https://en.wikipedia.org/wiki/Pataleshwar' },
      { label: 'Rashtrakuta Dynasty', url: 'https://en.wikipedia.org/wiki/Rashtrakuta_dynasty' },
    ],
    imageQuery: 'rock cut cave temple india ancient',
  },
];
