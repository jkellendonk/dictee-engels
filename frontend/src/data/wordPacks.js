// Elk onderwerp (topic) bevat losse arrays van { english, dutch } per
// oefen-onderdeel (categorie): woorden, werkwoorden en zinnen — zie de
// TOPICS-export onderaan dit bestand.
//
// Bij "you"-vervoegingen maakt het Engels geen onderscheid tussen enkelvoud
// (jij) en meervoud (jullie), terwijl het Nederlands dat wel doet. Zo'n paar
// krijgt een `hint` ('jij' of 'jullie') die alleen als extra aanwijzing bij de
// vraag getoond wordt (zie promptWord in utils.js) — nooit onderdeel van het
// te typen antwoord.

const ACTIVITIES_WORDS = [
  { english: 'hobbies', dutch: "hobby's" },
  { english: 'to play the piano', dutch: 'piano spelen' },
  { english: 'to listen to music', dutch: 'muziek luisteren' },
  { english: 'to watch a movie', dutch: 'film kijken' },
  { english: 'to play football', dutch: 'voetballen' },
  { english: 'sports', dutch: 'sporten' },
  { english: 'volleyball', dutch: 'volleybal' },
  { english: 'skiing', dutch: 'skiën' },
  { english: 'tennis', dutch: 'tennis' },
  { english: 'hockey', dutch: 'hockey' },
  { english: 'horse-riding', dutch: 'paardrijden' },
  { english: 'boxing', dutch: 'boksen' },
  { english: 'skating', dutch: 'schaatsen' },
  { english: 'swimming', dutch: 'zwemmen' },
  { english: 'jobs', dutch: 'banen' },
  { english: 'journalist', dutch: 'journalist' },
  { english: 'teacher', dutch: 'leerkracht' },
  { english: 'dentist', dutch: 'tandarts' },
  { english: 'plumber', dutch: 'loodgieter' },
  { english: 'doctor', dutch: 'dokter' },
  { english: 'carpenter', dutch: 'timmerman' },
]

const ACTIVITIES_VERBS = [
  { english: 'verbs', dutch: 'werkwoorden' },
  { english: 'to look', dutch: 'kijken' },
  { english: 'to go', dutch: 'gaan' },
  { english: 'will', dutch: 'zal' },
  { english: 'made', dutch: 'maakte' },
  { english: 'to do', dutch: 'doen' },
  { english: 'came', dutch: 'kwam' },
  { english: 'called', dutch: 'genoemd' },
  { english: 'asked', dutch: 'gevraagd' },
  { english: 'saw', dutch: 'zag' },
  { english: 'to make', dutch: 'maken' },
]

const ANIMALS_WORDS = [
  { english: 'monkey', dutch: 'aap' },
  { english: 'spider', dutch: 'spin' },
  { english: 'crab', dutch: 'krab' },
  { english: 'birds', dutch: 'vogels' },
  { english: 'lizard', dutch: 'hagedis' },
  { english: 'crocodile', dutch: 'krokodil' },
  { english: 'snake', dutch: 'slang' },
  { english: 'elephant', dutch: 'olifant' },
  { english: 'mouse', dutch: 'muis' },
  { english: 'mice', dutch: 'muizen' },
  { english: 'owl', dutch: 'uil' },
  { english: 'eagle', dutch: 'arend' },
  { english: 'goose', dutch: 'gans' },
  { english: 'geese', dutch: 'ganzen' },
  { english: 'fish', dutch: 'vissen' },
  { english: 'fly', dutch: 'vlieg' },
  { english: 'ladybug', dutch: 'lieveheersbeestje' },
  { english: 'bee', dutch: 'bij' },
  { english: 'butterfly', dutch: 'vlinder' },
  { english: 'butterflies', dutch: 'vlinders' },
  { english: 'caterpillar', dutch: 'rups' },
  { english: 'cockroach', dutch: 'kakkerlak' },
  { english: 'grasshopper', dutch: 'sprinkhaan' },
  { english: 'beetle', dutch: 'kever' },
  { english: 'ant', dutch: 'mier' },
  { english: 'wasp', dutch: 'wesp' },
  { english: 'tick', dutch: 'teek' },
  { english: 'creature', dutch: 'wezen' },
  { english: 'humans', dutch: 'mensen' },
]

const ANIMALS_VERBS = [
  { english: 'to feed the cat', dutch: 'de kat eten geven' },
  { english: 'to walk the dog', dutch: 'de hond uitlaten' },
  { english: 'to protect', dutch: 'beschermen' },
  { english: 'to fly', dutch: 'vliegen' },
  { english: 'to jump', dutch: 'springen' },
  { english: 'to swim', dutch: 'zwemmen' },
  { english: 'to be', dutch: 'zijn' },
  { english: 'I am', dutch: 'ik ben' },
  { english: 'you are', dutch: 'jij bent', hint: 'jij' },
  { english: 'he/she/it is', dutch: 'hij/zij/het is' },
  { english: 'we are', dutch: 'wij zijn' },
  { english: 'you are', dutch: 'jullie zijn', hint: 'jullie' },
  { english: 'they are', dutch: 'zij zijn' },
]

const CREATIVITY_WORDS = [
  { english: 'art', dutch: 'kunst' },
  { english: 'brush', dutch: 'kwast' },
  { english: 'to paint', dutch: 'schilderen' },
  { english: 'scissors', dutch: 'schaar' },
  { english: 'paper', dutch: 'papier' },
  { english: 'thinking', dutch: 'nadenken' },
  { english: 'creativity', dutch: 'creativiteit' },
  { english: 'magic', dutch: 'magie' },
  { english: 'something', dutch: 'iets' },
  { english: 'someone', dutch: 'iemand' },
  { english: 'presentation', dutch: 'presentatie' },
  { english: 'experiments', dutch: 'experimenten' },
  { english: 'research', dutch: 'onderzoek' },
  { english: 'researcher', dutch: 'onderzoeker' },
  { english: 'poem', dutch: 'gedicht' },
  { english: 'fantasy', dutch: 'fantasie' },
  { english: 'actor', dutch: 'acteur' },
  { english: 'actress', dutch: 'actrice' },
]

const CREATIVITY_VERBS = [
  { english: 'to make', dutch: 'maken' },
  { english: 'I make', dutch: 'ik maak' },
  { english: 'he/she/it makes', dutch: 'hij/zij/het maakt' },
  { english: 'we make', dutch: 'wij maken' },
  { english: 'you make', dutch: 'jullie maken' },
  { english: 'they make', dutch: 'zij maken' },
  { english: 'made by', dutch: 'gemaakt door' },
  { english: 'I made', dutch: 'ik maakte' },
  { english: 'to create', dutch: 'creëren' },
  { english: 'to think', dutch: 'denken' },
  { english: 'to write', dutch: 'schrijven' },
  { english: 'to paint', dutch: 'schilderen' },
]

const EARTH_WORDS = [
  { english: 'climate', dutch: 'klimaat' },
  { english: 'temperature', dutch: 'temperatuur' },
  { english: 'weather', dutch: 'weer' },
  { english: '30 degrees Celsius', dutch: '30 graden Celsius' },
  { english: 'geography', dutch: 'aardrijkskunde' },
  { english: 'earth', dutch: 'aarde' },
  { english: 'global warming', dutch: 'opwarming van de aarde' },
  { english: 'climate change', dutch: 'klimaatverandering' },
  { english: 'rainforest', dutch: 'regenwoud' },
  { english: 'earthquake', dutch: 'aardbeving' },
  { english: 'environment', dutch: 'milieu' },
  { english: 'surroundings', dutch: 'omgeving' },
  { english: 'wood', dutch: 'hout' },
  { english: 'mountains', dutch: 'bergen' },
  { english: 'landscape', dutch: 'landschap' },
  { english: 'capital', dutch: 'hoofdstad' },
  { english: 'village', dutch: 'dorp' },
  { english: 'beach', dutch: 'strand' },
  { english: 'city', dutch: 'stad' },
  { english: 'hill', dutch: 'heuvel' },
  { english: 'forest', dutch: 'woud' },
  { english: 'river', dutch: 'rivier' },
]

const EARTH_VERBS = [
  { english: 'to use', dutch: 'gebruiken' },
  { english: 'to think', dutch: 'denken' },
  { english: 'to need', dutch: 'nodig hebben' },
  { english: 'to happen', dutch: 'gebeuren' },
  { english: 'to continue', dutch: 'doorgaan' },
  { english: 'to increase', dutch: 'toenemen' },
  { english: 'I think', dutch: 'ik denk' },
  { english: 'you think', dutch: 'jij denkt', hint: 'jij' },
  { english: 'he/she/it thinks', dutch: 'hij/zij/het denkt' },
  { english: 'we think', dutch: 'wij denken' },
  { english: 'you think', dutch: 'jullie denken', hint: 'jullie' },
  { english: 'they think', dutch: 'zij denken' },
]

const PEOPLE_WORDS = [
  { english: 'aunt', dutch: 'tante' },
  { english: 'brother', dutch: 'broer' },
  { english: 'cousin', dutch: 'neef/nicht' },
  { english: 'daughter', dutch: 'dochter' },
  { english: 'father', dutch: 'vader' },
  { english: 'granddaughter', dutch: 'kleindochter' },
  { english: 'grandmother', dutch: 'oma' },
  { english: 'grandson', dutch: 'kleinzoon' },
  { english: 'mother', dutch: 'moeder' },
  { english: 'nephew', dutch: 'neefje' },
  { english: 'niece', dutch: 'nichtje' },
  { english: 'sister', dutch: 'zus' },
  { english: 'son', dutch: 'zoon' },
  { english: 'stepdaughter', dutch: 'stiefdochter' },
  { english: 'stepmother', dutch: 'stiefmoeder' },
  { english: 'stepson', dutch: 'stiefzoon' },
  { english: 'uncle', dutch: 'oom' },
  { english: 'back', dutch: 'rug' },
  { english: 'cheeks', dutch: 'wangen' },
  { english: 'chest', dutch: 'borst' },
  { english: 'chin', dutch: 'kin' },
  { english: 'ears', dutch: 'oren' },
  { english: 'eyebrows', dutch: 'wenkbrauwen' },
  { english: 'eyes', dutch: 'ogen' },
  { english: 'feet', dutch: 'voeten' },
  { english: 'fingers', dutch: 'vingers' },
  { english: 'foot', dutch: 'voet' },
  { english: 'forehead', dutch: 'voorhoofd' },
  { english: 'hair', dutch: 'haar' },
  { english: 'hands', dutch: 'handen' },
  { english: 'head', dutch: 'hoofd' },
  { english: 'hips', dutch: 'heupen' },
  { english: 'knees', dutch: 'knieën' },
  { english: 'legs', dutch: 'benen' },
  { english: 'lips', dutch: 'lippen' },
  { english: 'mouth', dutch: 'mond' },
  { english: 'neck', dutch: 'nek' },
  { english: 'nose', dutch: 'neus' },
  { english: 'shoulders', dutch: 'schouders' },
  { english: 'stomach', dutch: 'maag' },
  { english: 'teeth', dutch: 'tanden' },
  { english: 'throat', dutch: 'keel' },
  { english: 'toes', dutch: 'tenen' },
  { english: 'tongue', dutch: 'tong' },
  { english: 'tooth', dutch: 'tand' },
  { english: 'waist', dutch: 'middel, taille' },
]

const EMOTIONS_WORDS = [
  { english: 'feelings', dutch: 'gevoelens' },
  { english: 'proud', dutch: 'trots' },
  { english: 'sad', dutch: 'verdrietig' },
  { english: 'angry', dutch: 'boos' },
  { english: 'curious', dutch: 'nieuwsgierig' },
  { english: 'nervous', dutch: 'nerveus' },
  { english: 'jealous', dutch: 'jaloers' },
  { english: 'surprised', dutch: 'verrast' },
  { english: 'joy', dutch: 'vreugde' },
  { english: 'alone', dutch: 'alleen' },
  { english: 'happy', dutch: 'blij' },
  { english: 'bored', dutch: 'verveeld' },
  { english: 'tired', dutch: 'moe' },
  { english: 'scared', dutch: 'bang' },
  { english: 'funny', dutch: 'grappig' },
  { english: 'easy', dutch: 'makkelijk' },
  { english: 'difficult', dutch: 'moeilijk' },
  { english: 'good', dutch: 'goed' },
]

const EMOTIONS_VERBS = [
  { english: 'verb to feel', dutch: 'werkwoord voelen' },
  { english: 'I feel', dutch: 'ik voel' },
  { english: 'you feel', dutch: 'jij voelt', hint: 'jij' },
  { english: 'he/she/it feels', dutch: 'hij/zij/het voelt' },
  { english: 'we feel', dutch: 'wij voelen' },
  { english: 'you feel', dutch: 'jullie voelen', hint: 'jullie' },
  { english: 'they feel', dutch: 'zij voelen' },
  { english: 'to remember', dutch: 'herinneren' },
  { english: 'to believe', dutch: 'geloven' },
  { english: 'to dislike', dutch: 'iets niet leuk vinden' },
  { english: 'to thank', dutch: 'bedanken' },
  { english: 'to become', dutch: 'worden' },
]

const STYLE_WORDS = [
  { english: 'wardrobe', dutch: 'garderobe' },
  { english: 'belt', dutch: 'riem' },
  { english: 'blouse', dutch: 'blouse' },
  { english: 'boots', dutch: 'laarzen' },
  { english: 'cap', dutch: 'pet/muts' },
  { english: 'trousers', dutch: 'broek' },
  { english: 'coat', dutch: 'jas' },
  { english: 'dress', dutch: 'jurk' },
  { english: 'gloves', dutch: 'handschoenen' },
  { english: 'hat', dutch: 'hoed' },
  { english: 'jacket', dutch: 'jas' },
  { english: 'jeans', dutch: 'spijkerbroek' },
  { english: 'jumper', dutch: 'trui' },
  { english: 'mini-skirt', dutch: 'mini rok' },
  { english: 'overalls', dutch: 'overall' },
  { english: 'pants', dutch: 'broek' },
  { english: 'pantyhose', dutch: 'panty' },
  { english: 'raincoat', dutch: 'regenjas' },
  { english: 'scarf', dutch: 'sjaal' },
  { english: 'shirt', dutch: 'overhemd' },
  { english: 'shoes', dutch: 'schoenen' },
  { english: 'shorts', dutch: 'korte broek' },
  { english: 'skirt', dutch: 'rok' },
  { english: 'socks', dutch: 'sokken' },
  { english: 'suit', dutch: 'pak' },
]

const STYLE_VERBS = [
  { english: 'to wear', dutch: 'dragen (van kleding)' },
  { english: 'to walk', dutch: 'lopen' },
  { english: 'to change', dutch: 'veranderen; omkleden' },
  { english: 'to use', dutch: 'gebruiken' },
  { english: 'to need', dutch: 'nodig hebben' },
  { english: 'to try', dutch: 'proberen' },
  { english: 'I try', dutch: 'ik probeer' },
  { english: 'you try', dutch: 'jij probeert', hint: 'jij' },
  { english: 'he/she/it tries', dutch: 'hij/zij/het probeert' },
  { english: 'we try', dutch: 'wij proberen' },
  { english: 'you try', dutch: 'jullie proberen', hint: 'jullie' },
  { english: 'they try', dutch: 'zij proberen' },
]

const TIME_CELEBRATIONS_WORDS = [
  { english: 'Christmas', dutch: 'Kerstmis' },
  { english: 'tradition', dutch: 'traditie' },
  { english: 'celebration', dutch: 'viering' },
  { english: 'New year', dutch: 'Nieuwjaar' },
  { english: 'festivity', dutch: 'festiviteit' },
  { english: 'gift', dutch: 'geschenk' },
  { english: 'religion', dutch: 'religie' },
  { english: 'birth', dutch: 'geboorte' },
  { english: 'birthday', dutch: 'verjaardag' },
  { english: 'pumpkin', dutch: 'pompoen' },
  { english: 'ritual', dutch: 'ritueel' },
  { english: 'cake', dutch: 'taart' },
  { english: 'Easter', dutch: 'Pasen' },
  { english: 'wedding', dutch: 'bruiloft' },
  { english: 'Ramadan', dutch: 'Ramadan' },
  { english: "Valentine's Day", dutch: 'Valentijnsdag' },
  { english: 'Christmas tree', dutch: 'kerstboom' },
  { english: 'decoration', dutch: 'decoratie' },
  { english: 'family', dutch: 'familie' },
  { english: 'fireplace', dutch: 'open haard' },
  { english: 'holiday', dutch: 'vakantie' },
  { english: 'fireworks', dutch: 'vuurwerk' },
  { english: 'yesterday', dutch: 'gisteren' },
  { english: 'last week', dutch: 'vorige week' },
  { english: 'tomorrow', dutch: 'morgen' },
]

const TIME_CELEBRATIONS_VERBS = [
  { english: 'to celebrate', dutch: 'vieren' },
  { english: 'to gather', dutch: 'samenkomen' },
  { english: 'to sing', dutch: 'zingen' },
  { english: 'to cook', dutch: 'koken' },
  { english: 'to do the dishes', dutch: 'de afwas doen' },
  { english: 'I do', dutch: 'ik doe' },
  { english: 'you do', dutch: 'jij doet', hint: 'jij' },
  { english: 'he/she/it does', dutch: 'hij/zij/het doet' },
  { english: 'we do', dutch: 'wij doen' },
  { english: 'you do', dutch: 'jullie doen', hint: 'jullie' },
  { english: 'they do', dutch: 'zij doen' },
]

const ACTIVITIES_ZINNEN = [
  { english: 'I am going to see the dentist today.', dutch: 'Ik zal vandaag de tandarts bezoeken.' },
  {
    english: 'I like to listen to music in my own bedroom.',
    dutch: 'Ik vind het leuk om naar muziek te luisteren in mijn eigen slaapkamer.',
  },
  { english: 'I watch television in the evening.', dutch: 'Ik kijk televisie in de avond.' },
  { english: 'My mother made me a cupcake!', dutch: 'Mijn moeder maakte een cupcake voor mij!' },
]

const ANIMALS_ZINNEN = [
  { english: 'The beetle is sitting on the wall.', dutch: 'De kever zit op de muur.' },
  { english: 'The monkey is running very fast.', dutch: 'De aap rent erg snel.' },
  { english: 'The crocodile is swimming in the river.', dutch: 'De krokodil zwemt in de rivier.' },
  { english: 'Humans are taking care of the animals.', dutch: 'Mensen zorgen voor de dieren.' },
  { english: "I'm afraid of spiders!", dutch: 'Ik ben bang voor spinnen!' },
]

const CREATIVITY_ZINNEN = [
  { english: 'My father is a researcher in a big company.', dutch: 'Mijn vader is onderzoeker in een groot bedrijf.' },
  { english: 'I like to paint animals on paper.', dutch: 'Ik houd van dieren schilderen op papier.' },
  { english: 'We have a presentation about a continent.', dutch: 'We hebben een presentatie over een werelddeel.' },
  { english: 'My brother is an actor in a movie.', dutch: 'Mijn broer is een acteur in een film.' },
  { english: 'My sister likes to write a poem.', dutch: 'Mijn zus vindt het leuk om een gedicht te schrijven.' },
]

const EARTH_ZINNEN = [
  { english: 'The climate is changing.', dutch: 'Het klimaat is aan het veranderen.' },
  { english: 'Arnhem is the capital of Gelderland.', dutch: 'Arnhem is de hoofdstad van Gelderland.' },
  { english: 'I need a computer for geography.', dutch: 'Ik heb een computer nodig voor aardrijkskunde.' },
  { english: "It's busy in the city!", dutch: 'Het is druk in de stad!' },
  { english: 'Do you think we are going on holiday?', dutch: 'Denken jullie dat we op vakantie gaan?' },
]

const PEOPLE_ZINNEN = [
  {
    english: 'I live together with my parents, younger brother and older sister.',
    dutch: 'Ik woon samen met mijn ouders, jongere broertje en oudere zus.',
  },
  { english: 'My mother has brown hair and green eyes.', dutch: 'Mijn moeder heeft bruin haar en groene ogen.' },
  {
    english: 'We get along very well with our cousins.',
    dutch: 'We kunnen het heel goed vinden met onze neefjes en nichtjes.',
  },
  { english: 'My grandmother is almost 90 years old.', dutch: 'Mijn oma is bijna 90 jaar oud.' },
]

const EMOTIONS_ZINNEN = [
  { english: 'My dog is very happy!', dutch: 'Mijn hond is erg blij!' },
  { english: 'My brother is angry.', dutch: 'Mijn broer is boos.' },
  { english: 'Your sister is afraid of spiders.', dutch: 'Jouw zus is bang voor spinnen.' },
  { english: 'Tamara is in love with Simon.', dutch: 'Tamara is verliefd op Simon.' },
  { english: 'My cat likes to eat fish.', dutch: 'Mijn kat vindt het lekker om vis te eten.' },
]

const STYLE_ZINNEN = [
  { english: "I'm wearing a raincoat with a scarf.", dutch: 'Ik draag een regenjas met een sjaal.' },
  { english: 'I try to change my clothes.', dutch: 'Ik probeer mijn kleren te veranderen.' },
  { english: 'I need a suit for the party.', dutch: 'Ik heb een pak nodig voor het feest.' },
  { english: "I'm walking with my hat in my hand.", dutch: 'Ik loop met mijn hoed in mijn hand.' },
  { english: 'Put on your boots!', dutch: 'Doe je laarzen aan!' },
]

const TIME_CELEBRATIONS_ZINNEN = [
  {
    english: 'What did your teacher say when you arrived late?',
    dutch: 'Wat zei de leerkracht toen je te laat aan kwam?',
  },
  { english: 'Yesterday we had a Christmas celebration.', dutch: 'Gisteren hadden we een Kerstviering.' },
  { english: "I'm sending you a postcard on Valentine's Day.", dutch: 'Ik stuur je een kaart op Valentijnsdag.' },
  { english: 'She reads a book in the evening.', dutch: 'Zij leest een boek in de avond.' },
  { english: 'We are singing a song about the Christmas tree.', dutch: 'Wij zingen een lied over de Kerstboom.' },
]

// Elk onderwerp (topic) geldt voor zowel Groep 7 als Groep 8 en heeft een of
// meer onderdelen (categorieën): woorden, werkwoorden en/of zinnen. Het enige
// verschil tussen de groepen is dat de categorie "zinnen" alleen zichtbaar is
// met het Groep 8-vinkje aan — zie api.js.
export const TOPICS = {
  Emotions: {
    categories: { woorden: EMOTIONS_WORDS, werkwoorden: EMOTIONS_VERBS, zinnen: EMOTIONS_ZINNEN },
  },
  Style: {
    categories: { woorden: STYLE_WORDS, werkwoorden: STYLE_VERBS, zinnen: STYLE_ZINNEN },
  },
  'Time-Celebrations': {
    categories: { woorden: TIME_CELEBRATIONS_WORDS, werkwoorden: TIME_CELEBRATIONS_VERBS, zinnen: TIME_CELEBRATIONS_ZINNEN },
  },
  Animals: {
    categories: { woorden: ANIMALS_WORDS, werkwoorden: ANIMALS_VERBS, zinnen: ANIMALS_ZINNEN },
  },
  Earth: {
    categories: { woorden: EARTH_WORDS, werkwoorden: EARTH_VERBS, zinnen: EARTH_ZINNEN },
  },
  People: {
    categories: { woorden: PEOPLE_WORDS, zinnen: PEOPLE_ZINNEN },
  },
  Activities: {
    categories: { woorden: ACTIVITIES_WORDS, werkwoorden: ACTIVITIES_VERBS, zinnen: ACTIVITIES_ZINNEN },
  },
  Creativity: {
    categories: { woorden: CREATIVITY_WORDS, werkwoorden: CREATIVITY_VERBS, zinnen: CREATIVITY_ZINNEN },
  },
}
