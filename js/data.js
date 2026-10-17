/**
 * MEDMOST - Data Store for Treatments, Hospitals, Support Services, and Translations
 * Extracted and aligned directly with the official 8-page brochure reference
 */

window.MEDMOST_DATA = {
  treatments: [
    {
      id: "cardiac",
      titleEn: "Cardiac Care / Heart Treatment",
      titleRu: "Кардиология и сердечная хирургия",
      category: "critical",
      image: "assets/images/treatments/treatment-cardiac.jpg",
      costIndia: "$4,000–8,000",
      costTurkey: "$8,000–15,000",
      costEurope: "$20,000–40,000",
      costUSA: "$70,000–120,000",
      stayDuration: "7–10 days",
      proceduresEn: [
        "Coronary Artery Bypass Graft (CABG)",
        "Heart Valve Replacement & Repair",
        "Angioplasty & Complex Stenting",
        "Heart Failure & Pacemaker Management",
        "Paediatric Cardiac Surgery"
      ],
      proceduresRu: [
        "Аортокоронарное шунтирование (АКШ)",
        "Замена и пластика сердечных клапанов",
        "Ангиопластика и сложное стентирование",
        "Лечение сердечной недостаточности",
        "Детская кардиохирургия"
      ],
      descriptionEn: "World-renowned cardiac centers in Delhi NCR equipped with hybrid catheterization labs, achieving over 99% surgical success rates for international cardiac patients.",
      descriptionRu: "Ведущие кардиохирургические центры в Дели и НКР с гибридными катетеризационными лабораториями и показателем успешности операций более 99%."
    },
    {
      id: "cancer",
      titleEn: "Cancer Care / Oncology",
      titleRu: "Онкология",
      category: "critical",
      image: "assets/images/treatments/treatment-cancer.jpg",
      costIndia: "$4,000–12,000",
      costTurkey: "$8,000–20,000",
      costEurope: "$25,000–60,000",
      costUSA: "$80,000–2,000,000",
      stayDuration: "14–21 days",
      proceduresEn: [
        "Medical, Surgical & Radiation Oncology",
        "Bone Marrow Transplant (Autologous & Allogeneic)",
        "Targeted Therapy & Immunotherapy",
        "CyberKnife & TrueBeam Precision Radiotherapy",
        "Robotic-Assisted Tumor Resection"
      ],
      proceduresRu: [
        "Лекарственное, хирургическое и лучевое лечение",
        "Трансплантация костного мозга (ТКМ)",
        "Таргетная терапия и иммунотерапия",
        "Высокоточная радиотерапия CyberKnife и TrueBeam",
        "Роботизированное удаление опухолей"
      ],
      descriptionEn: "Comprehensive multidisciplinary oncology tumor boards, precision genomic diagnosis, and cutting-edge immunotherapies at a fraction of Western costs.",
      descriptionRu: "Комплексные онкологические консилиумы, молекулярно-генетическая диагностика и передовая таргетная терапия по доступным ценам."
    },
    {
      id: "transplant",
      titleEn: "Organ Transplant",
      titleRu: "Трансплантация органов",
      category: "critical",
      image: "assets/images/treatments/treatment-transplant.jpg",
      costIndia: "$15,000–35,000",
      costTurkey: "$30,000–60,000",
      costEurope: "$80,000–150,000",
      costUSA: "$2,000,000–4,000,000",
      stayDuration: "21–30 days",
      proceduresEn: [
        "Living Donor Kidney Transplantation",
        "Living Donor Liver Transplantation",
        "Bone Marrow & Stem Cell Transplant",
        "Comprehensive Pre-transplant Screening",
        "Dedicated Sterile Transplant ICU Care"
      ],
      proceduresRu: [
        "Трансплантация почки от живого донора",
        "Трансплантация печени от живого донора",
        "Трансплантация костного мозга и стволовых клеток",
        "Комплексное предоперационное обследование",
        "Специализированные стерильные реанимации"
      ],
      descriptionEn: "India is globally acclaimed for high-volume liver and kidney transplantations with strict compliance with the Transplantation of Human Organs Act.",
      descriptionRu: "Индия признана мировым центром успешных трансплантаций почек и печени со строгим соблюдением международных протоколов."
    },
    {
      id: "orthopaedics",
      titleEn: "Orthopaedics & Joint Surgery",
      titleRu: "Ортопедия и хирургия суставов",
      category: "surgical",
      image: "assets/images/treatments/treatment-orthopaedics.jpg",
      costIndia: "$5,000–8,000",
      costTurkey: "$8,000–15,000",
      costEurope: "$20,000–40,000",
      costUSA: "$60,000–1,000,000",
      stayDuration: "7–12 days",
      proceduresEn: [
        "Robotic-Assisted Total Knee Replacement",
        "Minimal Invasive Total Hip Replacement",
        "Spine Surgery & Vertebral Fixation",
        "Arthroscopic Ligament Reconstruction (ACL/PCL)",
        "Complex Bone & Joint Disorders"
      ],
      proceduresRu: [
        "Роботизированная замена коленного сустава",
        "Малоинвазивное эндопротезирование тазобедренного сустава",
        "Хирургия позвоночника и фиксация дисков",
        "Артроскопическая пластика связок (ПХС)",
        "Лечение заболеваний костей и суставов"
      ],
      descriptionEn: "Sub-millimeter robotic precision joint replacements allowing rapid weight-bearing, minimal blood loss, and swift return to active mobility.",
      descriptionRu: "Роботизированное эндопротезирование суставов с субмиллиметровой точностью, позволяющее вставать на ноги в первые дни."
    },
    {
      id: "neuro",
      titleEn: "Neurosciences & Brain Surgery",
      titleRu: "Неврология и нейрохирургия",
      category: "critical",
      image: "assets/images/treatments/treatment-neuro.jpg",
      costIndia: "$6,000–15,000",
      costTurkey: "$12,000–25,000",
      costEurope: "$30,000–70,000",
      costUSA: "$1,00,000–2,50,000",
      stayDuration: "10–14 days",
      proceduresEn: [
        "Brain Tumour Navigation & Microdissection",
        "Minimally Invasive Spine Surgery",
        "Acute Stroke Intervention & Coiling",
        "Refractory Epilepsy Surgery",
        "Comprehensive Neuro-Rehabilitation"
      ],
      proceduresRu: [
        "Удаление опухолей мозга с нейронавигацией",
        "Малоинвазивная хирургия позвоночника",
        "Лечение инсульта и эндоваскулярная эмболизация",
        "Хирургическое лечение эпилепсии",
        "Комплексная нейрореабилитация"
      ],
      descriptionEn: "Equipped with intraoperative 3T MRI, Zeiss neuro-microscopes, and neuromonitoring to safeguard neural pathways during cranial and spinal procedures.",
      descriptionRu: "Оснащение интраоперационными томографами 3Т МРТ и микроскопами Zeiss для максимальной безопасности структур мозга."
    },
    {
      id: "eye",
      titleEn: "Eye Care / Ophthalmology",
      titleRu: "Офтальмология",
      category: "specialised",
      image: "assets/images/treatments/treatment-eye.jpg",
      costIndia: "$1,000–3,000",
      costTurkey: "$1,500–4,000",
      costEurope: "$4,000–10,000",
      costUSA: "$8,000–20,000",
      stayDuration: "3–5 days",
      proceduresEn: [
        "Blade-Free Femto Laser Cataract Surgery",
        "Contoura Vision & Custom LASIK",
        "Retina Surgeries & Vitrectomy",
        "Corneal Grafting & Keratoplasty",
        "Glaucoma Drainage Devices"
      ],
      proceduresRu: [
        "Лазерное удаление катаракты (Фемто-фако)",
        "Лазерная коррекция зрения LASIK и Contoura Vision",
        "Хирургия сетчатки и витрэктомия",
        "Кератопластика и пересадка роговицы",
        "Хирургическое лечение глаукомы"
      ],
      descriptionEn: "Advanced ambulatory eye procedures with cutting-edge German and American laser platforms, providing rapid visual rehabilitation.",
      descriptionRu: "Передовая офтальмохирургия на немецких и американских лазерных платформах с быстрым восстановлением зрения."
    },
    {
      id: "fertility",
      titleEn: "Women's Health & Fertility (IVF)",
      titleRu: "Женское здоровье и ЭКО",
      category: "specialised",
      image: "assets/images/treatments/treatment-fertility.jpg",
      costIndia: "$2,500–5,000",
      costTurkey: "$3,500–7,000",
      costEurope: "$8,000–15,000",
      costUSA: "$12,000–25,000",
      stayDuration: "14–18 days",
      proceduresEn: [
        "IVF / ICSI with Laser-Assisted Hatching",
        "Preimplantation Genetic Testing (PGT-A)",
        "Advanced Gynaecological Laparoscopy",
        "High-Risk Obstetric & Pregnancy Care",
        "Uterine Fibroid & Endometriosis Care"
      ],
      proceduresRu: [
        "Программы ЭКО / ИКСИ с лазерным хэтчингом",
        "Предимплантационная генетическая диагностика (ПГД)",
        "Лапароскопические гинекологические операции",
        "Ведение беременностей высокого риска",
        "Лечение миомы матки и эндометриоза"
      ],
      descriptionEn: "High IVF success rates led by senior reproductive endocrinologists and embryologists utilizing state-of-the-art cleanroom laboratories.",
      descriptionRu: "Высокие показатели наступления беременности в специализированных лабораториях под руководством опытных репродуктологов."
    },
    {
      id: "gastro",
      titleEn: "Gastroenterology & Liver Treatment",
      titleRu: "Гастроэнтерология и гепатология",
      category: "surgical",
      image: "assets/images/treatments/treatment-gastro.jpg",
      costIndia: "$3,000–8,000",
      costTurkey: "$6,000–12,000",
      costEurope: "$15,000–35,000",
      costUSA: "$50,000–1,00,000",
      stayDuration: "5–9 days",
      proceduresEn: [
        "Liver Cirrhosis & Portal Hypertension Care",
        "GI Onco-Surgeries & Bariatrics",
        "Advanced Endoscopy, Colonoscopy & ERCP",
        "Pancreatic & Gallbladder Diseases",
        "Inflammatory Bowel Disease Management"
      ],
      proceduresRu: [
        "Лечение цирроза и портальной гипертензии",
        "Хирургия органов ЖКТ и бариатрия",
        "Эндоскопия, колоноскопия и ЭРХПГ",
        "Лечение заболеваний поджелудочной железы",
        "Терапия воспалительных заболеваний кишечника"
      ],
      descriptionEn: "Comprehensive digestive science institutes providing interventional endoscopy and non-invasive liver elastography assessment.",
      descriptionRu: "Институты пищеварительных наук, предлагающие интервенционную эндоскопию и передовые методы лечения печени."
    },
    {
      id: "urology",
      titleEn: "Urology Treatment",
      titleRu: "Урологические процедуры",
      category: "surgical",
      image: "assets/images/treatments/treatment-urology.jpg",
      costIndia: "$2,000–6,000",
      costTurkey: "$5,000–10,000",
      costEurope: "$12,000–30,000",
      costUSA: "$40,000–80,000",
      stayDuration: "3–7 days",
      proceduresEn: [
        "Retrograde Intrarenal Surgery (RIRS / PCNL)",
        "Holmium Laser Enucleation of Prostate (HoLEP)",
        "Robotic Radical Prostatectomy",
        "Male Infertility & Andrology Care",
        "Urethral Reconstruction"
      ],
      proceduresRu: [
        "Лазерное дробление камней почек (RIRS / PCNL)",
        "Лазерная энуклеация простаты (HoLEP)",
        "Роботизированные операции на предстательной железе",
        "Лечение мужского бесплодия и андрология",
        "Пластика мочеточников и уретры"
      ],
      descriptionEn: "Painless laser stone fragmentations and robotic prostate interventions minimizing post-operative hospital stay.",
      descriptionRu: "Безболезненное лазерное дробление камней и роботизированные вмешательства с минимальным сроком госпитализации."
    },
    {
      id: "dental",
      titleEn: "Dental Care & Full Rehabilitation",
      titleRu: "Стоматологическое лечение",
      category: "specialised",
      image: "assets/images/treatments/treatment-dental.jpg",
      costIndia: "$500–3,000",
      costTurkey: "$1,000–4,000",
      costEurope: "$5,000–12,000",
      costUSA: "$10,000–25,000",
      stayDuration: "5–8 days",
      proceduresEn: [
        "All-on-4 & All-on-6 Immediate Dental Implants",
        "Full Mouth Bite & Smile Reconstruction",
        "Zirconia Crowns & Porcelain Veneers",
        "Painless Root Canal & Laser Dentistry",
        "Digital 3D Cone Beam CT Planning"
      ],
      proceduresRu: [
        "Имплантация All-on-4 и All-on-6 с немедленной нагрузкой",
        "Полная реконструкция зубного ряда",
        "Циркониевые коронки и керамические виниры",
        "Лазерная стоматология и лечение каналов",
        "Цифровое 3D планирование на компьютерном томографе"
      ],
      descriptionEn: "Complete international smile makeover utilizing Swiss and German titanium implants with lifetime warranties.",
      descriptionRu: "Полное преображение улыбки с швейцарскими и немецкими титановыми имплантами с пожизненной гарантией."
    },
    {
      id: "pulmonology",
      titleEn: "Pulmonology & Respiratory Care",
      titleRu: "Пульмонология",
      category: "specialised",
      image: "assets/images/treatments/treatment-pulmonology.jpg",
      costIndia: "$2,000–6,000",
      costTurkey: "$4,000–9,000",
      costEurope: "$10,000–25,000",
      costUSA: "$35,000–70,000",
      stayDuration: "5–9 days",
      proceduresEn: [
        "Severe Asthma & Refractory COPD Management",
        "Interventional Diagnostic Bronchoscopy (EBUS)",
        "Pulmonary Rehabilitation & Oxygen Protocols",
        "Thoracic Surgeries & Lung Volume Reduction",
        "Obstructive Sleep Apnea Sleep Lab"
      ],
      proceduresRu: [
        "Лечение тяжелой астмы и ХОБЛ",
        "Интервенционная бронхоскопия и EBUS",
        "Легочная реабилитация и кислородотерапия",
        "Торакальная хирургия легких",
        "Диагностика и лечение нарушений дыхания во сне"
      ],
      descriptionEn: "Dedicated respiratory ICUs and advanced lung diagnostics treating complicated pulmonary disorders with proven outcomes.",
      descriptionRu: "Специализированные пульмонологические отделения и лаборатории для лечения сложных заболеваний дыхательных путей."
    },
    {
      id: "plasticsurgery",
      titleEn: "Plastic & Reconstructive Surgery",
      titleRu: "Пластическая и реконструктивная хирургия",
      category: "surgical",
      image: "assets/images/treatments/treatment-plasticsurgery.jpg",
      costIndia: "$2,000–6,000",
      costTurkey: "$4,000–10,000",
      costEurope: "$10,000–30,000",
      costUSA: "$30,000–70,000",
      stayDuration: "7–12 days",
      proceduresEn: [
        "Facial Aesthetics, Facelift & Rhinoplasty",
        "Post-Burn Reconstruction & Scar Revision",
        "Microvascular Free Tissue Transfer",
        "Body Contouring, Tummy Tuck & Liposuction",
        "Cleft Lip & Palate Correction"
      ],
      proceduresRu: [
        "Пластика лица, подтяжка и ринопластика",
        "Реконструкция после ожогов и коррекция рубцов",
        "Микрососудистая реконструкция тканей",
        "Липосакция и абдоминопластика",
        "Устранение врожденных дефектов лица"
      ],
      descriptionEn: "Highly skilled plastic surgeons achieving natural-looking cosmetic enhancements and life-changing reconstructive outcomes.",
      descriptionRu: "Высококвалифицированные пластические хирурги, обеспечивающие эстетичный и естественный результат."
    }
  ],

  hospitals: [
    {
      id: "apollo",
      name: "Indraprastha Apollo Hospitals",
      city: "New Delhi",
      cityKey: "delhi",
      image: "assets/images/hospitals/hospital-apollo.jpg",
      specialtiesEn: ["Cancer Care", "Heart Care", "Organ Transplant", "Neurosciences"],
      specialtiesRu: ["Онкология", "Кардиология", "Трансплантация органов", "Неврология"],
      accreditation: "JCI & NABH Accredited",
      beds: "710+ Beds",
      overviewEn: "One of Asia's most trusted hospital networks, Apollo Delhi performed India's first successful pediatric liver transplant and treats over 100,000 international patients annually.",
      overviewRu: "Один из самых авторитетных медицинских комплексов Азии, где была проведена первая в Индии успешная трансплантация печени ребенку."
    },
    {
      id: "fortis",
      name: "Fortis Escorts Heart Institute",
      city: "New Delhi",
      cityKey: "delhi",
      image: "assets/images/hospitals/hospital-fortis.jpg",
      specialtiesEn: ["Heart Care", "Cardiac Surgery", "Interventional Cardiology", "Paediatrics"],
      specialtiesRu: ["Кардиология", "Кардиохирургия", "Интервенционная кардиология", "Педиатрия"],
      accreditation: "JCI & NABH Accredited",
      beds: "310+ Beds",
      overviewEn: "Globally recognized pioneer in cardiac excellence, having performed over 80,000 coronary angiographies and complex bypass surgeries with world-class survival rates.",
      overviewRu: "Всемирно известный центр кардиологии, выполнивший более 80 000 операций на сердце с превосходными клиническими показателями."
    },
    {
      id: "blkmax",
      name: "BLK-Max Super Speciality Hospital",
      city: "New Delhi",
      cityKey: "delhi",
      image: "assets/images/hospitals/hospital-blkmax.jpg",
      specialtiesEn: ["Cancer Care", "Bone Marrow Transplant", "Neurosciences", "Organ Transplant"],
      specialtiesRu: ["Онкология", "Трансплантация костного мозга", "Неврология", "Трансплантация органов"],
      accreditation: "JCI & NABH Accredited",
      beds: "650+ Beds",
      overviewEn: "Home to one of the largest bone marrow transplant centers in Asia, BLK-Max features 125 critical care beds and 17 state-of-the-art modular operation theatres.",
      overviewRu: "Крупнейший центр трансплантации костного мозга в Азии, оснащенный 17 модульными операционными и 125 реанимационными койками."
    },
    {
      id: "max",
      name: "Max Super Speciality Hospital",
      city: "Saket, New Delhi",
      cityKey: "delhi",
      image: "assets/images/hospitals/hospital-max.jpg",
      specialtiesEn: ["Oncology", "Cardiology", "Orthopaedics", "Neurosciences"],
      specialtiesRu: ["Онкология", "Кардиология", "Ортопедия", "Неврология"],
      accreditation: "JCI & NABH Accredited",
      beds: "530+ Beds",
      overviewEn: "Premier medical destination offering Da Vinci Xi surgical robotics, Novalis Tx radiosurgery, and dedicated specialized wards for international patients.",
      overviewRu: "Ведущий медицинский центр с хирургическими роботами Da Vinci Xi, системой радиохирургии Novalis Tx и палатами повышенной комфортности."
    },
    {
      id: "medanta",
      name: "Medanta – The Medicity",
      city: "Gurugram",
      cityKey: "gurugram",
      image: "assets/images/hospitals/hospital-medanta.jpg",
      specialtiesEn: ["Cardiac Sciences", "Liver & Kidney Transplant", "Cancer Care", "Spine Surgery"],
      specialtiesRu: ["Кардиология", "Трансплантация печени и почек", "Онкология", "Хирургия позвоночника"],
      accreditation: "JCI & NABH Accredited",
      beds: "1,250+ Beds",
      overviewEn: "Ranked among Newsweek's Best Hospitals in the World, Medanta is a massive 43-acre medical hub housing six specialized institutes led by legendary clinicians.",
      overviewRu: "Входит в рейтинг лучших больниц мира по версии Newsweek. Огромный медицинский город на 43 акрах с шестью специализированными институтами."
    },
    {
      id: "artemis",
      name: "Artemis Hospital",
      city: "Gurugram",
      cityKey: "gurugram",
      image: "assets/images/hospitals/hospital-artemis.jpg",
      specialtiesEn: ["Cancer Care", "Orthopaedics", "Neurosciences", "Women's Health"],
      specialtiesRu: ["Онкология", "Ортопедия", "Неврология", "Женское здоровье"],
      accreditation: "JCI & NABH Accredited",
      beds: "400+ Beds",
      overviewEn: "The first JCI-accredited hospital in Gurugram, designed with patient-centric architecture, high-efficiency infection control, and digital ICU workflows.",
      overviewRu: "Первая больница в Гуруграме, аккредитованная JCI, с передовым инфекционным контролем и цифровыми отделениями интенсивной терапии."
    },
    {
      id: "yashoda",
      name: "Yashoda Super Speciality Hospitals",
      city: "Kaushambi, Ghaziabad",
      cityKey: "ghaziabad",
      image: "assets/images/hospitals/hospital-yashoda.jpg",
      specialtiesEn: ["Oncology", "Cardiac Care", "Nephrology & Transplant", "Urology"],
      specialtiesRu: ["Онкология", "Кардиология", "Нефрология и трансплантация", "Урология"],
      accreditation: "NABH & NABL Accredited",
      beds: "450+ Beds",
      overviewEn: "Renowned for high-acuity multi-organ management, advanced radiation therapies including Varian TrueBeam, and dedicated kidney dialysis units.",
      overviewRu: "Известна высоким уровнем лечения тяжелых заболеваний, лучевой терапией Varian TrueBeam и современным отделением диализа."
    },
    {
      id: "amrita",
      name: "Amrita Hospital",
      city: "Faridabad",
      cityKey: "faridabad",
      image: "assets/images/hospitals/hospital-amrita.jpg",
      specialtiesEn: ["Multi-Speciality", "Oncology", "Neurosciences", "Organ Transplant"],
      specialtiesRu: ["Многопрофильная помощь", "Онкология", "Неврология", "Трансплантация органов"],
      accreditation: "NABH Accredited",
      beds: "2,600+ Beds",
      overviewEn: "One of the largest private super-specialty hospitals in South Asia spanning 130 acres, boasting 64 fully-equipped operation theatres and 534 critical care beds.",
      overviewRu: "Один из крупнейших медицинских комплексов Южной Азии на 130 акрах с 64 операционными залами и 534 койками интенсивной терапии."
    },
    {
      id: "gangaram",
      name: "Sir Ganga Ram Hospital",
      city: "New Delhi",
      cityKey: "delhi",
      image: "assets/images/hospitals/hospital-gangaram.jpg",
      specialtiesEn: ["Cardiology", "Orthopaedics", "Neurosciences", "Internal Medicine"],
      specialtiesRu: ["Кардиология", "Ортопедия", "Неврология", "Терапия и диагностика"],
      accreditation: "NABH & ISO Certified",
      beds: "675+ Beds",
      overviewEn: "Historic legacy hospital established in 1954, trusted by heads of state and diplomats for internal medicine, nephrology, and complex abdominal surgery.",
      overviewRu: "Легендарная больница, основанная в 1954 году, пользующаяся доверием дипломатов и иностранных пациентов за высочайшую точность диагностики."
    },
    {
      id: "manipal",
      name: "Manipal Hospital",
      city: "Dwarka, New Delhi",
      cityKey: "delhi",
      image: "assets/images/hospitals/hospital-manipal.jpg",
      specialtiesEn: ["Cancer Care", "Robotic Surgery", "Orthopaedics", "Urology"],
      specialtiesRu: ["Онкология", "Роботизированная хирургия", "Ортопедия", "Урология"],
      accreditation: "NABH & NABL Accredited",
      beds: "380+ Beds",
      overviewEn: "Modern quaternary care facility strategically located 15 minutes from New Delhi International Airport, equipped with pneumatic chute systems and AI radiology.",
      overviewRu: "Современная клиника в 15 минутах от международного аэропорта Дели, оснащенная роботизированной хирургией и цифровой радиологией."
    },
    {
      id: "ckbirla",
      name: "CK Birla Hospital (RBH)",
      city: "Gurugram",
      cityKey: "gurugram",
      image: "assets/images/hospitals/hospital-ckbirla.jpg",
      specialtiesEn: ["Oncology", "Orthopaedics", "Women's Health", "Digestive Sciences"],
      specialtiesRu: ["Онкология", "Ортопедия", "Женское здоровье", "Гастроэнтерология"],
      accreditation: "NABH Accredited",
      beds: "200+ Beds",
      overviewEn: "Boutique multi-specialty healthcare delivering clinical protocols aligned with UK NHS guidelines, providing exceptional privacy and bespoke patient suites.",
      overviewRu: "Многопрофильная клиника британского стандарта с протоколами NHS, гарантирующая высокий комфорт и приватность для пациентов."
    },
    {
      id: "shalby",
      name: "Shalby Multi-Speciality Hospital",
      city: "Gurugram",
      cityKey: "gurugram",
      image: "assets/images/hospitals/hospital-shalby.jpg",
      specialtiesEn: ["Joint Replacement", "Spine Care", "Orthopaedics", "Sports Medicine"],
      specialtiesRu: ["Эндопротезирование суставов", "Хирургия позвоночника", "Ортопедия", "Спортивная медицина"],
      accreditation: "NABH Accredited",
      beds: "250+ Beds",
      overviewEn: "Part of the Shalby healthcare group, pioneers of the 'Zero Technique' knee replacement that slashes surgical time and ensures rapid patient discharge.",
      overviewRu: "Часть всемирно известной сети Shalby, разработчиков уникальной методики эндопротезирования суставов с минимальной реабилитацией."
    }
  ],

  supportServices: [
    {
      id: "treatment",
      icon: "💎",
      titleEn: "Advanced Treatment",
      titleRu: "Современное лечение",
      descEn: "Latest medical technology and state-of-the-art facilities for complex medical conditions.",
      descRu: "Новейшие технологии и современные медицинские учреждения для лечения широкого спектра заболеваний."
    },
    {
      id: "doctors",
      icon: "👨‍⚕️",
      titleEn: "Expert Doctors",
      titleRu: "Опытные специалисты",
      descEn: "Care from highly qualified and internationally experienced specialists.",
      descRu: "Забота от высококвалифицированных и опытных врачей с международной подготовкой."
    },
    {
      id: "prices",
      icon: "₹",
      titleEn: "Affordable Prices",
      titleRu: "Доступные цены",
      descEn: "World-class treatment without catastrophic financial burden.",
      descRu: "Лечение мирового уровня без чрезмерных финансовых затрат."
    },
    {
      id: "stay",
      icon: "🏨",
      titleEn: "Comfortable Stay",
      titleRu: "Комфортное проживание",
      descEn: "Clean, vetted apartments & hotels near hospitals with Kyrgyz/Central Asian cuisine available.",
      descRu: "Удобное размещение для пациентов и сопровождающих с возможностью питания в кыргызском стиле."
    },
    {
      id: "transport",
      icon: "🚘",
      titleEn: "Local Transport",
      titleRu: "Транспорт и трансферы",
      descEn: "Free airport pick-up, dedicated hospital visits, and city travel arranged smoothly.",
      descRu: "Встреча в аэропорту, поездки в больницу и передвижение по городу организуются нами."
    },
    {
      id: "translator",
      icon: "🗣",
      titleEn: "Interpreter Support",
      titleRu: "Услуги переводчика",
      descEn: "Dedicated Russian, Kyrgyz, and Uzbek-speaking medical interpreters present at all doctor consults.",
      descRu: "Профессиональные медицинские переводчики для комфортного и точного общения с врачами."
    },
    {
      id: "visa",
      icon: "🛂",
      titleEn: "Visa & Travel Assistance",
      titleRu: "Помощь с визой и поездкой",
      descEn: "Official hospital invitation letters for Medical Visa (MED-1), flight booking, and paperwork.",
      descRu: "Официальные приглашения от клиник для визы, помощь с документами и авиабилетами."
    },
    {
      id: "followup",
      icon: "💻",
      titleEn: "Follow-Up Care",
      titleRu: "Дальнейшее наблюдение",
      descEn: "Post-treatment teleconsultations and continued clinical guidance after returning home.",
      descRu: "Последующие онлайн-консультации и постоянное сопровождение врачей после возвращения домой."
    },
    {
      id: "personalised",
      icon: "🤝",
      titleEn: "Personalised Support",
      titleRu: "Индивидуальный подход",
      descEn: "A dedicated personal care manager assigned to guide you at every single step of your journey.",
      descRu: "Наша команда всегда рядом, чтобы помочь вам на каждом этапе лечения."
    }
  ]
};
