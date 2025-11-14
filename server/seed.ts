import { db } from "../db";
import { categories, lessons, questions } from "@shared/schema";

const intersectionImage = "/attached_assets/generated_images/Four-way_intersection_diagram_c1ef561c.png";
const roadSignsImage = "/attached_assets/generated_images/Road_signs_collection_b6d31949.png";
const dashboardImage = "/attached_assets/generated_images/Car_dashboard_controls_diagram_caab3a6f.png";
const overtakingImage = "/attached_assets/generated_images/Safe_overtaking_scenario_1e2f5468.png";
const roundaboutImage = "/attached_assets/generated_images/Roundabout_traffic_flow_f5106849.png";

async function seed() {
  console.log("Starting database seeding...");

  // Create categories
  const categoryData = [
    { nameFr: "Panneaux de Signalisation", nameMg: "Famantarana Lalana", icon: "SignpostBig" },
    { nameFr: "Règles de Circulation", nameMg: "Fitsipiky ny Fifamoivoizana", icon: "CircleAlert" },
    { nameFr: "Sécurité Routière", nameMg: "Fiarovana eny an-dalana", icon: "ShieldCheck" },
    { nameFr: "Véhicule et Mécanique", nameMg: "Fiara sy Mekanika", icon: "CarFront" },
    { nameFr: "Priorités", nameMg: "Laharam-pahamehana", icon: "Navigation" },
    { nameFr: "Stationnement", nameMg: "Fijanonana", icon: "ParkingCircle" },
  ];

  const createdCategories = await db.insert(categories).values(categoryData).returning();
  console.log(`Created ${createdCategories.length} categories`);

  const [roadSigns, traffic, safety, vehicle, priority, parking] = createdCategories;

  // Create lessons
  const lessonData = [
    // Road Signs
    {
      categoryId: roadSigns.id,
      titleFr: "Les Panneaux de Danger",
      titleMg: "Famantarana Loza",
      contentFr: "Les panneaux de danger sont de forme triangulaire avec un bord rouge. Ils avertissent les conducteurs d'un danger potentiel à venir. Il est important de ralentir et d'être vigilant lorsque vous voyez ces panneaux. Ces panneaux peuvent indiquer des virages dangereux, des passages à niveau, des zones de travaux ou d'autres situations nécessitant une attention particulière.",
      contentMg: "Ny famantarana loza dia telozoro miaraka amin'ny sisiny mena. Mampitandrina ny mpamily fa misy loza mety hitranga. Zava-dehibe ny mampihena ny hafainganam-pandeha sy mitandrina rehefa mahita ireo famantarana ireo. Ireo famantarana ireo dia afaka mampiseho fiolahana be loza, fita-lalana, faritra miasa na toe-javatra hafa mila fiheverana manokana.",
      imageUrl: roadSignsImage,
      orderIndex: 0,
    },
    {
      categoryId: roadSigns.id,
      titleFr: "Les Panneaux d'Interdiction",
      titleMg: "Famantarana Fandrarana",
      contentFr: "Les panneaux d'interdiction sont circulaires avec un bord rouge et un fond blanc. Ils interdisent certaines actions comme dépasser, tourner, ou entrer dans une zone. Le non-respect de ces panneaux peut entraîner des amendes importantes ou des accidents graves. Assurez-vous toujours de bien comprendre ce qui est interdit.",
      contentMg: "Ny famantarana fandrarana dia boribory miaraka amin'ny sisiny mena sy fotsy. Mandrara asa sasany toy ny fandalo, fihodina, na fidirana amin'ny faritra. Ny tsy fanajana ireo famantarana ireo dia mety hiteraka sazy lehibe na lozam-pifamoivoizana mafy. Ataovy azo antoka foana fa mazava tsara aminao izay zavatra voarara.",
      imageUrl: roadSignsImage,
      orderIndex: 1,
    },
    // Traffic
    {
      categoryId: traffic.id,
      titleFr: "Les Feux de Signalisation",
      titleMg: "Jiro Famantarana",
      contentFr: "Les feux de signalisation régulent la circulation aux intersections. Le feu rouge oblige l'arrêt complet avant la ligne d'arrêt. Le feu orange signifie que vous devez vous préparer à vous arrêter si vous êtes suffisamment loin. Le feu vert autorise le passage après avoir vérifié que la voie est libre. Respectez toujours les feux pour votre sécurité et celle des autres.",
      contentMg: "Ny jiro famantarana dia mifehy ny fifamoivoizana eny an-tsampanan-dalana. Ny jiro mena dia manery ny fijanonana tanteraka alohan'ny tsipika fijanonana. Ny jiro volomboasary dia midika hoe tokony miomàna hijanona ianao raha lavitra tsara. Ny jiro maitso dia mamela ny fandehanana rehefa avy nanamarina fa tsy misy olana ny lalana. Hajao foana ny jiro ho an'ny fiarovana anao sy ny hafa.",
      imageUrl: intersectionImage,
      orderIndex: 0,
    },
    {
      categoryId: traffic.id,
      titleFr: "Le Dépassement Sécurisé",
      titleMg: "Fandalo Azo Antoka",
      contentFr: "Le dépassement doit être effectué uniquement lorsque c'est sûr et autorisé par la signalisation. Vérifiez toujours vos rétroviseurs et angle mort, signalez votre intention avec le clignotant, assurez-vous d'avoir une visibilité suffisante sur au moins 150 mètres, et une distance adéquate pour revenir dans votre voie. Ne dépassez jamais dans les virages, les sommets de côtes ou près des passages piétons.",
      contentMg: "Ny fandalo dia tokony hatao rehefa azo antoka sy ekena amin'ny famantarana ihany. Hamarino foana ny fitaratra sy ny zoro tsy hita, ambaro ny fikasanao amin'ny jiro mpanondro, ataovy azo antoka fa mahita tsara ianao amin'ny halavirana 150 metatra farafahakeliny, ary misy elanelana ampy hiverenana amin'ny lalanao. Aza mandalo amin'ny fiolahana, tampony havoana na eo akaikin'ny lalan'ny mpandeha an-tongotra.",
      imageUrl: overtakingImage,
      orderIndex: 1,
    },
    // Safety
    {
      categoryId: safety.id,
      titleFr: "La Ceinture de Sécurité",
      titleMg: "Fehikibo Fiarovana",
      contentFr: "Le port de la ceinture de sécurité est obligatoire pour tous les occupants du véhicule, à l'avant comme à l'arrière. Elle réduit considérablement les risques de blessures graves en cas d'accident, pouvant diminuer le risque de décès de 50%. Attachez toujours votre ceinture avant de démarrer le moteur et assurez-vous que tous les passagers font de même.",
      contentMg: "Ny fanaovana fehikibo fiarovana dia tsy maintsy atao ho an'ny mpitaingina rehetra, na eo anoloana na ao aoriana. Mampihena be ny loza amin'ny ratra lehibe raha sendra loza, afaka mampihena ny mety ho fahafatesana hatramin'ny 50%. Fehezina foana ny fehikibonao alohan'ny handefitra ny motera ary ataovy azo antoka fa manao toy izany koa ny mpandeha rehetra.",
      imageUrl: undefined,
      orderIndex: 0,
    },
    {
      categoryId: safety.id,
      titleFr: "La Distance de Sécurité",
      titleMg: "Halaviran'ny Fiarovana",
      contentFr: "Maintenir une distance de sécurité suffisante avec le véhicule devant vous est essentiel. La règle générale est de garder au moins 2 secondes d'intervalle en conditions normales, et 4 secondes par temps de pluie. Cette distance vous permet de réagir en cas de freinage brusque du véhicule qui vous précède.",
      contentMg: "Ny fitazonana halavirana fiarovana ampy amin'ny fiara eo alohanao dia tena ilaina. Ny fitsipika ankapobeny dia ny mitazona farafahakeliny 2 segondra amin'ny toe-javatra mahazatra, ary 4 segondra rehefa orana. Io halavirana io dia mamela anao hamaly raha mijanona tampoka ny fiara eo alohanao.",
      imageUrl: undefined,
      orderIndex: 1,
    },
    // Vehicle
    {
      categoryId: vehicle.id,
      titleFr: "Les Contrôles du Tableau de Bord",
      titleMg: "Ny Fitantanana ny Tableau de Bord",
      contentFr: "Le tableau de bord contient des commandes essentielles que tout conducteur doit maîtriser. Les clignotants permettent de signaler vos changements de direction aux autres usagers. Les feux de détresse doivent être utilisés en cas de panne ou de danger. Les commandes d'éclairage incluent les feux de croisement pour la nuit et les conditions de faible visibilité.",
      contentMg: "Ny tableau de bord dia ahitana baiko ilaina izay tokony hofehin'ny mpamily rehetra. Ny jiro mpanondro dia mamela anao hampahafantatra ny hafa ny fiovana lalaninao. Ny jiro loza dia tokony hampiasaina rehefa simba na misy loza ny fiara. Ny baikon'ny jiro dia ahitana ny jiro ambany ho an'ny alina sy ny toe-javatra tsy dia mazava loatra.",
      imageUrl: dashboardImage,
      orderIndex: 0,
    },
    // Priority
    {
      categoryId: priority.id,
      titleFr: "Priorité aux Ronds-Points",
      titleMg: "Laharam-pahamehana amin'ny Rond-Point",
      contentFr: "Dans un rond-point, les véhicules déjà engagés dans le rond-point ont toujours la priorité. Vous devez céder le passage aux véhicules venant de votre gauche avant d'entrer. Ralentissez à l'approche, regardez à gauche, et ne vous engagez que lorsque c'est sûr. Signalez votre sortie avec le clignotant droit au niveau de la sortie précédente.",
      contentMg: "Ao amin'ny rond-point, ny fiara efa miditra ao amin'ny rond-point dia manana ny laharam-pahamehana foana. Tokony homena lalana ny fiara avy any ankavianao alohan'ny hiditra. Mihena hafainganam-pandeha eo akaikin'ny, mijery ankavia, ary midira rehefa azo antoka ihany. Ambaro ny fivoahanao amin'ny jiro mpanondro havanana eo amin'ny fivoahana teo alohany.",
      imageUrl: roundaboutImage,
      orderIndex: 0,
    },
    // Parking
    {
      categoryId: parking.id,
      titleFr: "Le Stationnement Autorisé",
      titleMg: "Fijanonana Ekena",
      contentFr: "Le stationnement est autorisé uniquement dans les zones prévues à cet effet et marquées par une signalisation appropriée. Respectez les marquages au sol (lignes blanches ou bleues) et les panneaux indicateurs. Ne bloquez jamais les passages piétons, les entrées de propriété, les bouches d'incendie, ou les zones réservées aux personnes handicapées sans autorisation.",
      contentMg: "Ny fijanonana dia ekena amin'ny toerana natokana ho an'izany ihany ary voamariky ny famantarana mety. Hajao ny famantarana amin'ny tany (tsipika fotsy na manga) sy ny famantarana mpanondro. Aza manakana ny lalan'ny mpandeha an-tongotra, ny fidirana amin'ny trano, ny loharanom-pamonoana afo, na ny faritra natokana ho an'ny olona sembana raha tsy mahazo alalana.",
      imageUrl: undefined,
      orderIndex: 0,
    },
  ];

  const createdLessons = await db.insert(lessons).values(lessonData).returning();
  console.log(`Created ${createdLessons.length} lessons`);

  // Create questions
  const questionData = [
    // Road Signs questions
    {
      categoryId: roadSigns.id,
      questionFr: "Que signifie un panneau octogonal rouge avec STOP écrit en blanc?",
      questionMg: "Inona no dikan'ny famantarana octogonal mena misy STOP fotsy?",
      imageUrl: roadSignsImage,
      option1Fr: "Ralentir et céder le passage si nécessaire",
      option1Mg: "Mampihena hafainganam-pandeha sy manome lalana raha ilaina",
      option2Fr: "Arrêt obligatoire avant la ligne",
      option2Mg: "Tsy maintsy mijanona alohan'ny tsipika",
      option3Fr: "Interdiction de s'arrêter",
      option3Mg: "Tsy mahazo mijanona",
      option4Fr: "Sens interdit",
      option4Mg: "Tsy mahazo miditra",
      correctAnswer: 1,
    },
    {
      categoryId: roadSigns.id,
      questionFr: "Que signifie un panneau triangulaire avec un bord rouge?",
      questionMg: "Inona no dikan'ny famantarana telozoro misy sisiny mena?",
      imageUrl: roadSignsImage,
      option1Fr: "Panneau de danger",
      option1Mg: "Famantarana loza",
      option2Fr: "Panneau d'interdiction",
      option2Mg: "Famantarana fandrarana",
      option3Fr: "Panneau d'indication",
      option3Mg: "Famantarana fampahalalana",
      option4Fr: "Panneau de priorité",
      option4Mg: "Famantarana laharam-pahamehana",
      correctAnswer: 0,
    },
    {
      categoryId: roadSigns.id,
      questionFr: "Quelle est la vitesse maximale autorisée dans une zone scolaire?",
      questionMg: "Inona ny hafainganam-pandeha ambony indrindra ekena ao amin'ny faritra misy sekoly?",
      imageUrl: undefined,
      option1Fr: "20 km/h",
      option1Mg: "20 km/h",
      option2Fr: "30 km/h",
      option2Mg: "30 km/h",
      option3Fr: "40 km/h",
      option3Mg: "40 km/h",
      option4Fr: "50 km/h",
      option4Mg: "50 km/h",
      correctAnswer: 1,
    },
    // Traffic questions
    {
      categoryId: traffic.id,
      questionFr: "Que devez-vous faire à un feu orange?",
      questionMg: "Inona no tokony hataonao amin'ny jiro volomboasary?",
      imageUrl: intersectionImage,
      option1Fr: "Accélérer pour passer rapidement",
      option1Mg: "Manafaingana mba handalo haingana",
      option2Fr: "S'arrêter si c'est sécuritaire",
      option2Mg: "Mijanona raha azo antoka",
      option3Fr: "Continuer normalement",
      option3Mg: "Mitohy toy ny mahazatra",
      option4Fr: "Klaxonner et continuer",
      option4Mg: "Manisy trompetra ary mitohy",
      correctAnswer: 1,
    },
    {
      categoryId: traffic.id,
      questionFr: "Quelle est la fonction des feux de détresse?",
      questionMg: "Inona ny asan'ny jiro loza?",
      imageUrl: dashboardImage,
      option1Fr: "Signaler un danger ou une panne",
      option1Mg: "Mampahafantatra loza na fahapotehan'ny fiara",
      option2Fr: "Éclairer la route la nuit",
      option2Mg: "Manazava ny lalana amin'ny alina",
      option3Fr: "Indiquer un changement de direction",
      option3Mg: "Mampiseho fiovana lalana",
      option4Fr: "Activer les essuie-glaces",
      option4Mg: "Mandefitra ny mpamafa rano",
      correctAnswer: 0,
    },
    {
      categoryId: traffic.id,
      questionFr: "À quelle vitesse maximale pouvez-vous rouler en agglomération?",
      questionMg: "Amin'ny hafainganam-pandeha ambony indrindra ahoana no azonao aleha any an-tanàn-dehibe?",
      imageUrl: undefined,
      option1Fr: "40 km/h",
      option1Mg: "40 km/h",
      option2Fr: "50 km/h",
      option2Mg: "50 km/h",
      option3Fr: "60 km/h",
      option3Mg: "60 km/h",
      option4Fr: "70 km/h",
      option4Mg: "70 km/h",
      correctAnswer: 1,
    },
    // Safety questions
    {
      categoryId: safety.id,
      questionFr: "Pourquoi porter une ceinture de sécurité est-il important?",
      questionMg: "Nahoana no zava-dehibe ny fanaovana fehikibo fiarovana?",
      imageUrl: undefined,
      option1Fr: "C'est obligatoire par la loi",
      option1Mg: "Voataky ny lalàna",
      option2Fr: "Réduit les blessures en cas d'accident",
      option2Mg: "Mampihena ny ratra rehefa loza",
      option3Fr: "Évite les amendes",
      option3Mg: "Misoroka ny sazy",
      option4Fr: "Toutes les réponses ci-dessus",
      option4Mg: "Ny valiny rehetra etsy ambony",
      correctAnswer: 3,
    },
    {
      categoryId: safety.id,
      questionFr: "Quelle distance de sécurité devez-vous maintenir par temps de pluie?",
      questionMg: "Halavirana fiarovana firy no tokony hotazonao rehefa orana?",
      imageUrl: undefined,
      option1Fr: "1 seconde",
      option1Mg: "1 segondra",
      option2Fr: "2 secondes",
      option2Mg: "2 segondra",
      option3Fr: "4 secondes",
      option3Mg: "4 segondra",
      option4Fr: "6 secondes",
      option4Mg: "6 segondra",
      correctAnswer: 2,
    },
    // Vehicle questions
    {
      categoryId: vehicle.id,
      questionFr: "Quand devez-vous utiliser vos feux de croisement?",
      questionMg: "Rahoviana no tokony hampiasana ny jiro ambany?",
      imageUrl: dashboardImage,
      option1Fr: "Seulement la nuit",
      option1Mg: "Amin'ny alina ihany",
      option2Fr: "La nuit et par faible visibilité",
      option2Mg: "Amin'ny alina sy rehefa tsy dia mazava",
      option3Fr: "Jamais en ville",
      option3Mg: "Tsy amin'ny tanàna mihitsy",
      option4Fr: "Uniquement sur autoroute",
      option4Mg: "Amin'ny autoroute ihany",
      correctAnswer: 1,
    },
    // Priority questions
    {
      categoryId: priority.id,
      questionFr: "Dans un rond-point, qui a la priorité?",
      questionMg: "Ao amin'ny rond-point, iza no manana ny laharam-pahamehana?",
      imageUrl: roundaboutImage,
      option1Fr: "Les véhicules qui entrent",
      option1Mg: "Ny fiara miditra",
      option2Fr: "Les véhicules déjà dans le rond-point",
      option2Mg: "Ny fiara efa ao amin'ny rond-point",
      option3Fr: "Les véhicules venant de droite",
      option3Mg: "Ny fiara avy any havanana",
      option4Fr: "Le premier arrivé",
      option4Mg: "Ilay tonga voalohany",
      correctAnswer: 1,
    },
    // Parking questions
    {
      categoryId: parking.id,
      questionFr: "Où est-il interdit de se garer?",
      questionMg: "Aiza no tsy mahazo mijanona?",
      imageUrl: undefined,
      option1Fr: "Devant une bouche d'incendie",
      option1Mg: "Eo anoloan'ny loharanom-pamonoana afo",
      option2Fr: "Sur un passage piéton",
      option2Mg: "Eo amin'ny lalan'ny mpandeha an-tongotra",
      option3Fr: "Dans une zone handicapée sans autorisation",
      option3Mg: "Ao amin'ny faritra ho an'ny sembana tsy misy alalana",
      option4Fr: "Toutes les réponses ci-dessus",
      option4Mg: "Ny valiny rehetra etsy ambony",
      correctAnswer: 3,
    },
  ];

  const createdQuestions = await db.insert(questions).values(questionData).returning();
  console.log(`Created ${createdQuestions.length} questions`);

  console.log("Database seeding completed successfully!");
}

seed()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
