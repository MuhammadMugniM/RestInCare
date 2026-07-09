export type BeliefType = 'islamic' | 'christian' | 'buddhist' | 'hindu' | 'general';

export interface BeliefConfig {
  id: BeliefType;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  steps: string[]; // Custom check list steps
  traditions: string[];
}

export interface PackageConfig {
  id: 'basic' | 'premium' | 'exclusive';
  name: string;
  tagline: string;
  basePrice: number;
  features: string[];
  description: string;
}

export interface CustomOption {
  id: string;
  name: string;
  category: 'facility' | 'ritual' | 'amenity';
  price: number;
  description: string;
}

export interface PlanningState {
  belief: BeliefType;
  packageId: 'basic' | 'premium' | 'exclusive';
  selectedOptions: string[]; // custom options IDs
  deceasedName: string;
  applicantName: string;
  applicantPhone: string;
  applicantRelation: string;
  specialRequests: string;
  dateOfPassing: string;
  locationOfPassing: string;
  deathCertificateFile?: string; // name of uploaded file
  documentUrl?: string; // cloudinary url of uploaded file
  funeralHomeStartDate?: string; // start date for funeral home rental
  cateringPortions?: number; // portion size for catering
  coffinDimension?: 'standar' | 'menengah' | 'ekstra'; // dimensions for coffin
  cemeteryCity?: string;
  cemeteryName?: string;
}

export const BELIEFS: BeliefConfig[] = [
  {
    id: 'islamic',
    name: 'Pemakaman Islam (Fardhu Kifayah)',
    subtitle: 'Kehormatan Syariat Lengkap',
    icon: 'MoonStar',
    description: 'Pelaksanaan seluruh fardhu kifayah jenazah secara syar\'i, tenang, dan terhormat dipandu oleh asisten keagamaan bersertifikasi.',
    steps: [
      'Memandikan jenazah sesuai tata cara syariat oleh tim mahram (sesuai gender)',
      'Mengkafani secara lengkap dengan kain kafan wangi berkualitas prima',
      'Penyediaan kain ihram/tambahan & minyak wangi non-alkohol berkualitas tinggi',
      'Shalat Jenazah berjamaah yang dikoordinasikan langsung di masjid atau rumah duka',
      'Prosesi pemakaman lengkap (tanah makam, ustadz pemandu doa, papan nisan kayu sementara, tali kafan)'
    ],
    traditions: [
      'Pendampingan talqin di saat-saat terakhir (bila diperlukan)',
      'Sertifikat Fardhu Kifayah terselesaikan',
      'Air bunga mawar murni untuk tabur bunga di pusaran'
    ]
  },
  {
    id: 'christian',
    name: 'Pemakaman Kristen & Katolik',
    subtitle: 'Kebaktian & Penghormatan Kudus',
    icon: 'Cross',
    description: 'Penyelenggaraan ibadah duka, persiapan sakramen akhir, pemandian secara higienis terhormat, hingga upacara pelepasan gerejawi.',
    steps: [
      'Pemandian higienis komprehensif, formalinasi (sesuai standard kedokteran), tata rias duka wajah natural',
      'Peti duka berstandar tinggi dengan hiasan satin dan salib perak',
      'Kebaktian penghiburan duka dipimpin oleh Pendeta/Pastor paroki mitra',
      'Prosesi misa arwah / ibadah pelepasan duka sebelum keberangkatan',
      'Koordinasi pemakaman atau krematorium termasuk pengurusan tanah makam/kolumbarium'
    ],
    traditions: [
      'Buku nyanyian liturgi duka tercetak khusus untuk pelayat',
      'Salib penunjuk makam berbahan kayu jati berukir nama',
      'Dokumentasi foto prosesi liturgi pelepasan'
    ]
  },
  {
    id: 'buddhist',
    name: 'Pemakaman & Kremasi Buddha',
    subtitle: 'Penyeberangan Jiwa yang Damai',
    icon: 'Flame',
    description: 'Rangkaian upacara duka buddhis, pelantunan doa sutra oleh Sangha, penghormatan di kuil, pembakaran dupa wangi, hingga koordinasi kremasi.',
    steps: [
      'Pemandian higienis penuh hormat dan pemakaian jubah penyeberangan / setelan rapi',
      'Penyediaan meja altar duka Buddha lengkap dengan patung, buah segar, lilin merah besar, dan dupa aroma terapi',
      'Pembacaan doa sutra paritta oleh Bhikkhu Sangha selama malam persemayaman',
      'Prosesi pelepasan upacara duka Buddhis tradisi luhur',
      'Transportasi ber-AC ke krematorium mitra dan penjemputan abu abu suci'
    ],
    traditions: [
      'Kotak guci abu marmer berornamen ukiran teratai khusus',
      'Uang kertas altar persembahan luhur',
      'Lilin altar pelita kedamaian abadi'
    ]
  },
  {
    id: 'hindu',
    name: 'Kremasi Hindu (Ngaben)',
    subtitle: 'Pelepasan Jiwa menuju Moksa',
    icon: 'Flower',
    description: 'Upacara pembersihan suci jenazah Hindu, sesajen banten lengkap, prosesi pelepasan jiwa, hingga pengurusan upacara pengabuan / Ngaben.',
    steps: [
      'Pemandian upacara Nyiramin duka oleh keluarga dibantu rohaniwan Hindu',
      'Pembuatan sesaji banten pelepasan dirancang khusus oleh Pinandita',
      'Pelaksanaan krama / sembahyang duka keluarga mohon keselamatan atma',
      'Prosesi upacara kremasi Ngaben suci pada krematorium terpercaya',
      'Larung abu suci ke laut terdekat memakai kapal khusus yang aman'
    ],
    traditions: [
      'Kelapa gading mudra suci',
      'Pemberian Tirta Pengentas dari griya suci',
      'Kain putih tulus pelapis jenazah'
    ]
  },
  {
    id: 'general',
    name: 'Layanan Umum / Universal',
    subtitle: 'Kenangan Abadi yang Tenang',
    icon: 'Heart',
    description: 'Layanan kenegaraan, umum, atau non-keagamaan yang menitikberatkan pada dedikasi hidup almarhum dengan kehangatan dan rasa hormat yang mendalam.',
    steps: [
      'Perawatan jenazah estetika standar premium medis & kosmetika natural berkualitas tinggi',
      'Peti peristirahatan elegan beraksen minimalis modern',
      'Pengurusan seluruh berkas administrasi sipil seperti Akta Kematian dinas kesehatan setempat',
      'Upacara kenangan duka (Memorial Celebration) bercerita tentang pencapaian hidup almarhum',
      'Transportasi mobil jenazah premium ber-AC (Alphard/Vellfire Carriage) beserta escort pengawal'
    ],
    traditions: [
      'Layar digital memorial berisi foto kenangan masa hidup almarhum',
      'Buku tamu ttd elegan bersampul kulit buatan tangan',
      'Penyediaan suvenir memorial lilin aroma terapi pelayat'
    ]
  }
];

export const PACKAGES: PackageConfig[] = [
  {
    id: 'basic',
    name: 'Paket Asri (Sederhana)',
    tagline: 'Layanan Dasar yang Terhormat',
    basePrice: 3000000,
    features: [
      'Pelayanan ibadah dasar sesuai agama dan kepercayaan',
      'Pemandian & perawatan dasar jenazah',
      'Peti duka / perlengkapan kain kafan standar',
      'Mobil jenazah ber-AC dalam kota',
      '1 tim asisten pendamping keluarga',
      'Bantuan pengurusan dokumen (surat kematian RT/RW)'
    ],
    description: 'Dirancang untuk keluarga yang menghendaki layanan dasar dengan tetap menjaga rasa hormat bagi almarhum.'
  },
  {
    id: 'premium',
    name: 'Paket Mulia (Utama)',
    tagline: 'Layanan Lengkap untuk Keluarga Terkasih',
    basePrice: 6500000,
    features: [
      'Pelaksanaan upacara keagamaan lengkap',
      'Perawatan dan kosmetik jenazah profesional',
      'Peti kayu ukir elegan atau perlengkapan premium',
      'Mobil jenazah premium (Alphard / Mercedes-Benz)',
      '3 asisten siaga 24 jam untuk dekorasi & tamu',
      'Pengurusan Akta Kematian Dukcapil secara cepat',
      'Karangan bunga duka eksklusif (2 buah)'
    ],
    description: 'Pilihan ideal untuk ketenangan keluarga. Seluruh kebutuhan logistik dan administrasi ditangani secara menyeluruh.'
  },
  {
    id: 'exclusive',
    name: 'Paket Luhur (Premium)',
    tagline: 'Layanan Eksklusif dan Terlengkap',
    basePrice: 15000000,
    features: [
      'Pelaksanaan upacara keagamaan terlengkap',
      'Perawatan dan tata rias jenazah profesional',
      'Peti kayu jati solid berlapis beludru atau perlengkapan VIP',
      'Fasilitas Rumah Duka VVIP (gratis 1 malam)',
      'Koordinasi pemakaman VIP (San Diego Hills / sejenis)',
      'Mobil jenazah VIP & 1 mobil pengiring keluarga',
      'Katering untuk pelayat (100 porsi)',
      'Dokumentasi cetak premium & Live Streaming'
    ],
    description: 'Layanan penghormatan terbaik dan terlengkap. Kami menangani seluruh prosesi dari awal hingga pemakaman dengan standar tertinggi.'
  }
];

export const CUSTOM_OPTIONS: CustomOption[] = [
  {
    id: 'memorial_hall',
    name: 'Sewa Rumah Duka Premium (per Hari)',
    category: 'facility',
    price: 1500000,
    description: 'Ruang persemayaman ber-AC, sofa VIP, dispenser, internet kecepatan tinggi, dan fasilitas tunggu keluarga 24 jam.'
  },
  {
    id: 'catering',
    name: 'Catering Sajian Pelayat (100 Porsi)',
    category: 'amenity',
    price: 2000000,
    description: 'Menu masakan tradisional Indonesia higienis, bersih, ramah penyajian duka dengan teh/kopi air hangat tak terbatas.'
  },
  {
    id: 'coffin_upgrade',
    name: 'Upgrade Peti Kayu Jati Solid Ukir',
    category: 'ritual',
    price: 5000000,
    description: 'Peti berbahan kayu jati jepara pilihan berpelat kuningan murni, dipoles halus satin krem luhur.'
  },
  {
    id: 'cemetery_coordinates',
    name: 'Koordinasi Cavling & Gali Makam',
    category: 'facility',
    price: 3500000,
    description: 'Pengurusan kavling makam, penggali liang lahat, tenda duka di lokasi makam, sound system portabel, dan 50 kursi bercover kain.'
  },
  {
    id: 'livestreaming',
    name: 'Dokumentasi & Live Streaming Virtual VVIP',
    category: 'amenity',
    price: 750000,
    description: 'Kamera sinematik stabil, live streaming YouTube/Zoom privat terlindungi sandi agar kerabat jauh dapat beribadat bersama.'
  },
  {
    id: 'custom_floral',
    name: 'Dekorasi Altar Bunga Segar Estetis',
    category: 'ritual',
    price: 1000000,
    description: 'Hiasan bunga mawar putih segar, lily suci, krisan harum mengelilingi peti atau altar ritual secara anggun.'
  }
];
