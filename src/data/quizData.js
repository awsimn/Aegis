export const QUIZZES = [
  {
    id: "general",
    title: "General Preparedness",
    description: "Test your overall readiness for any emergency situation.",
    icon: "shield-checkmark",
    gradient: ["#4c669f", "#3b5998", "#192f6a"],
    questions: [
      {
        questionText: "What goes in a basic emergency supply kit?",
        answerOptions: [
          {
            answerText: "Water, food, battery-powered radio, flashlight",
            isCorrect: true,
          },
          { answerText: "Video games and snacks", isCorrect: false },
          { answerText: "Only clothes", isCorrect: false },
          { answerText: "Makeup and jewelry", isCorrect: false },
        ],
      },
      {
        questionText: "How much water should you store per person per day?",
        answerOptions: [
          { answerText: "1 Gallon", isCorrect: true },
          { answerText: "1 Cup", isCorrect: false },
          { answerText: "1 Liter", isCorrect: false },
          { answerText: "5 Gallons", isCorrect: false },
        ],
      },
      {
        questionText:
          "How often should you check and replace food in your kit?",
        answerOptions: [
          { answerText: "Every 6 months", isCorrect: true },
          { answerText: "Every 10 years", isCorrect: false },
          { answerText: "Never", isCorrect: false },
          { answerText: "Weekly", isCorrect: false },
        ],
      },
      {
        questionText: "Where is the best place to keep your emergency kit?",
        answerOptions: [
          {
            answerText: "A designated, easily accessible place",
            isCorrect: true,
          },
          { answerText: "In the attic", isCorrect: false },
          { answerText: "Buried in the backyard", isCorrect: false },
          { answerText: "Scattered around the house", isCorrect: false },
        ],
      },
      {
        questionText: "What is an 'Evacuation Plan'?",
        answerOptions: [
          { answerText: "A plan to leave a dangerous area", isCorrect: true },
          { answerText: "A plan to clean the house", isCorrect: false },
          { answerText: "A shopping list", isCorrect: false },
          { answerText: "A movie night schedule", isCorrect: false },
        ],
      },
      {
        questionText: "What should you do if you hear an emergency siren?",
        answerOptions: [
          {
            answerText: "Tune into local news/radio for instructions",
            isCorrect: true,
          },
          { answerText: "Ignore it", isCorrect: false },
          { answerText: "Run around screaming", isCorrect: false },
          { answerText: "Call all your friends", isCorrect: false },
        ],
      },
      {
        questionText: "Who should you include in your emergency plan?",
        answerOptions: [
          { answerText: "Family members and pets", isCorrect: true },
          { answerText: "Only yourself", isCorrect: false },
          { answerText: "Only your neighbors", isCorrect: false },
          { answerText: "No one", isCorrect: false },
        ],
      },
      {
        questionText: "Why is a whistle important in a kit?",
        answerOptions: [
          { answerText: "To signal for help", isCorrect: true },
          { answerText: "For entertainment", isCorrect: false },
          { answerText: "To scare animals", isCorrect: false },
          { answerText: "It looks cool", isCorrect: false },
        ],
      },
      {
        questionText: "What document is NOT critical to have copies of?",
        answerOptions: [
          { answerText: "Gym membership", isCorrect: true },
          { answerText: "Insurance policies", isCorrect: false },
          { answerText: "ID / Passports", isCorrect: false },
          { answerText: "Medical records", isCorrect: false },
        ],
      },
      {
        questionText: "What is the 'ICE' contact on your phone?",
        answerOptions: [
          { answerText: "In Case of Emergency", isCorrect: true },
          { answerText: "Ice Cream Express", isCorrect: false },
          { answerText: "Internal Control Engine", isCorrect: false },
          { answerText: "International Calling Enabled", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "earthquake",
    title: "Earthquake Safety",
    description: "Do you know what to do when the ground starts shaking?",
    icon: "earth",
    gradient: ["#D4145A", "#FBB03B"],
    questions: [
      {
        questionText: "What is the 'Golden Rule' during an earthquake?",
        answerOptions: [
          { answerText: "Drop, Cover, and Hold On", isCorrect: true },
          { answerText: "Run outside", isCorrect: false },
          { answerText: "Stand in a doorway", isCorrect: false },
          { answerText: "Scream loud", isCorrect: false },
        ],
      },
      {
        questionText: "If you are in bed during an earthquake, you should:",
        answerOptions: [
          {
            answerText: "Stay there and cover your head with a pillow",
            isCorrect: true,
          },
          { answerText: "Roll onto the floor", isCorrect: false },
          { answerText: "Run to the window", isCorrect: false },
          { answerText: "Stand on the bed", isCorrect: false },
        ],
      },
      {
        questionText: "Is it safe to stand in a doorway?",
        answerOptions: [
          {
            answerText: "No, in modern houses they are not stronger",
            isCorrect: true,
          },
          { answerText: "Yes, always", isCorrect: false },
          { answerText: "Only if it's wooden", isCorrect: false },
          { answerText: "Only if it's metal", isCorrect: false },
        ],
      },
      {
        questionText: "If you are driving, what should you do?",
        answerOptions: [
          { answerText: "Pull over to a clear area and stop", isCorrect: true },
          { answerText: "Speed up", isCorrect: false },
          { answerText: "Stop on a bridge", isCorrect: false },
          { answerText: "Get out and run", isCorrect: false },
        ],
      },
      {
        questionText: "What is an aftershock?",
        answerOptions: [
          {
            answerText: "A smaller earthquake following the main one",
            isCorrect: true,
          },
          { answerText: "A weather pattern", isCorrect: false },
          { answerText: "A power outage", isCorrect: false },
          { answerText: "A type of insurance", isCorrect: false },
        ],
      },
      {
        questionText: "Should you use elevators after an earthquake?",
        answerOptions: [
          { answerText: "No, never", isCorrect: true },
          { answerText: "Yes, it's faster", isCorrect: false },
          { answerText: "Only if you are tired", isCorrect: false },
          { answerText: "Only going down", isCorrect: false },
        ],
      },
      {
        questionText: "What is the biggest danger inside a house?",
        answerOptions: [
          { answerText: "Falling objects and furniture", isCorrect: true },
          { answerText: "The floor breaking", isCorrect: false },
          { answerText: "The dark", isCorrect: false },
          { answerText: "Pets panic", isCorrect: false },
        ],
      },
      {
        questionText:
          "If you are near the coast and feel a strong quake, you should:",
        answerOptions: [
          {
            answerText: "Move to higher ground (Tsunami risk)",
            isCorrect: true,
          },
          { answerText: "Go to the beach", isCorrect: false },
          { answerText: "Wait for a siren", isCorrect: false },
          { answerText: "Go swimming", isCorrect: false },
        ],
      },
      {
        questionText: "How can you secure tall furniture?",
        answerOptions: [
          { answerText: "Anchor them to wall studs", isCorrect: true },
          { answerText: "Glue them to the floor", isCorrect: false },
          { answerText: "Lean them against each other", isCorrect: false },
          { answerText: "Put heavy items on top", isCorrect: false },
        ],
      },
      {
        questionText: "When is it safe to return home?",
        answerOptions: [
          { answerText: "When authorities say it is safe", isCorrect: true },
          { answerText: "Immediately after shaking stops", isCorrect: false },
          { answerText: "When you feel like it", isCorrect: false },
          { answerText: "When the lights come on", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "flood",
    title: "Flood Awareness",
    description: "Stay dry and stay safe. Learn flood protocols.",
    icon: "water",
    gradient: ["#00c6ff", "#0072ff"],
    questions: [
      {
        questionText: "What does 'Turn Around, Don't Drown' refer to?",
        answerOptions: [
          { answerText: "Driving through flooded roads", isCorrect: true },
          { answerText: "Swimming lessons", isCorrect: false },
          { answerText: "Drinking water safety", isCorrect: false },
          { answerText: "Boating rules", isCorrect: false },
        ],
      },
      {
        questionText: "How much moving water can knock an adult down?",
        answerOptions: [
          { answerText: "6 inches", isCorrect: true },
          { answerText: "2 feet", isCorrect: false },
          { answerText: "1 inch", isCorrect: false },
          { answerText: "5 feet", isCorrect: false },
        ],
      },
      {
        questionText: "What is a 'Flash Flood'?",
        answerOptions: [
          {
            answerText: "A sudden, violent flood that peaks quickly",
            isCorrect: true,
          },
          { answerText: "A flood with lightning", isCorrect: false },
          { answerText: "A slow rising river", isCorrect: false },
          { answerText: "A flood used for photography", isCorrect: false },
        ],
      },
      {
        questionText: "If flood waters rise around your car, you should:",
        answerOptions: [
          {
            answerText: "Abandon the car and move to higher ground",
            isCorrect: true,
          },
          { answerText: "Stay inside and lock doors", isCorrect: false },
          { answerText: "Drive faster", isCorrect: false },
          { answerText: "Honk the horn", isCorrect: false },
        ],
      },
      {
        questionText:
          "What is the difference between a Flood Watch and Warning?",
        answerOptions: [
          {
            answerText:
              "Watch means possible; Warning means occurring/imminent",
            isCorrect: true,
          },
          { answerText: "They are the same", isCorrect: false },
          { answerText: "Warning is less severe", isCorrect: false },
          { answerText: "Watch means turn on TV", isCorrect: false },
        ],
      },
      {
        questionText: "Why should you avoid flood water?",
        answerOptions: [
          {
            answerText: "It may contain sewage, chemicals, and debris",
            isCorrect: true,
          },
          { answerText: "It is cold", isCorrect: false },
          { answerText: "It ruins clothes", isCorrect: false },
          { answerText: "Fish will bite", isCorrect: false },
        ],
      },
      {
        questionText: "Should you walk through moving water?",
        answerOptions: [
          { answerText: "No, never", isCorrect: true },
          { answerText: "Yes, if it looks shallow", isCorrect: false },
          { answerText: "Yes, if you hold hands", isCorrect: false },
          { answerText: "Yes, if you have boots", isCorrect: false },
        ],
      },
      {
        questionText: "How can you protect your home from flooding?",
        answerOptions: [
          { answerText: "Sandbags and elevating appliances", isCorrect: true },
          { answerText: "Open all windows", isCorrect: false },
          { answerText: "Turn on all lights", isCorrect: false },
          { answerText: "Water the lawn", isCorrect: false },
        ],
      },
      {
        questionText: "After a flood, what should you throw away?",
        answerOptions: [
          {
            answerText: "Food that may have touched floodwater",
            isCorrect: true,
          },
          { answerText: "Everything in the house", isCorrect: false },
          { answerText: "Nothing", isCorrect: false },
          { answerText: "Only wet paper", isCorrect: false },
        ],
      },
      {
        questionText: "Does standard home insurance cover floods?",
        answerOptions: [
          {
            answerText: "Usually NO, you need separate flood insurance",
            isCorrect: true,
          },
          { answerText: "Yes, always", isCorrect: false },
          { answerText: "Only on Tuesdays", isCorrect: false },
          { answerText: "Only for basements", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "fire",
    title: "Fire Safety",
    description: "Prevent fires and know how to escape safely.",
    icon: "flame",
    gradient: ["#ff9966", "#ff5e62"],
    questions: [
      {
        questionText: "What does 'Stop, Drop, and Roll' apply to?",
        answerOptions: [
          { answerText: "If your clothes catch fire", isCorrect: true },
          { answerText: "If you see a fire", isCorrect: false },
          { answerText: "If you burn your toast", isCorrect: false },
          { answerText: "If you smell smoke", isCorrect: false },
        ],
      },
      {
        questionText: "How often should you test smoke alarms?",
        answerOptions: [
          { answerText: "Monthly", isCorrect: true },
          { answerText: "Yearly", isCorrect: false },
          { answerText: "Never", isCorrect: false },
          { answerText: "Daily", isCorrect: false },
        ],
      },
      {
        questionText: "If a room is smoky, how should you exit?",
        answerOptions: [
          { answerText: "Crawl low under the smoke", isCorrect: true },
          { answerText: "Run quickly standing up", isCorrect: false },
          { answerText: "Walk normally", isCorrect: false },
          { answerText: "Hide in a closet", isCorrect: false },
        ],
      },
      {
        questionText: "What is the first thing to do if a fire starts?",
        answerOptions: [
          { answerText: "Get everyone out and call 911", isCorrect: true },
          { answerText: "Try to put it out yourself", isCorrect: false },
          { answerText: "Post on social media", isCorrect: false },
          { answerText: "Grab your valuables", isCorrect: false },
        ],
      },
      {
        questionText: "Where should your family meet after escaping?",
        answerOptions: [
          {
            answerText: "At a designated meeting spot outside",
            isCorrect: true,
          },
          { answerText: "In the kitchen", isCorrect: false },
          { answerText: "At the mall", isCorrect: false },
          { answerText: "In the garage", isCorrect: false },
        ],
      },
      {
        questionText: "Should you go back inside for a pet?",
        answerOptions: [
          { answerText: "No, tell firefighters instead", isCorrect: true },
          { answerText: "Yes, immediately", isCorrect: false },
          { answerText: "Yes, but hold your breath", isCorrect: false },
          { answerText: "Only if it's a dog", isCorrect: false },
        ],
      },
      {
        questionText: "What does PASS stand for (Extinguisher)?",
        answerOptions: [
          { answerText: "Pull, Aim, Squeeze, Sweep", isCorrect: true },
          { answerText: "Push, Aim, Shake, Spray", isCorrect: false },
          { answerText: "Pull, Ask, See, Stop", isCorrect: false },
          { answerText: "Put, Away, Some, Stuff", isCorrect: false },
        ],
      },
      {
        questionText: "Which items are highly flammable?",
        answerOptions: [
          {
            answerText: "Gasoline, rubbing alcohol, nail polish",
            isCorrect: true,
          },
          { answerText: "Water bottles", isCorrect: false },
          { answerText: "Metal spoons", isCorrect: false },
          { answerText: "Ceramic bowls", isCorrect: false },
        ],
      },
      {
        questionText: "Can you use water on a grease fire?",
        answerOptions: [
          { answerText: "No, it will spread the fire", isCorrect: true },
          { answerText: "Yes, it puts it out", isCorrect: false },
          { answerText: "Only hot water", isCorrect: false },
          { answerText: "Only cold water", isCorrect: false },
        ],
      },
      {
        questionText: "Why should you close doors when escaping?",
        answerOptions: [
          { answerText: "To slow the spread of fire/smoke", isCorrect: true },
          { answerText: "To lock the fire in", isCorrect: false },
          { answerText: "To protect your privacy", isCorrect: false },
          { answerText: "So no one steals things", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "firstaim",
    title: "Basic First Aid",
    description: "Essential medical knowledge for emergencies.",
    icon: "medkit",
    gradient: ["#11998e", "#38ef7d"],
    questions: [
      {
        questionText: "What is the universal number for emergencies in the US?",
        answerOptions: [
          { answerText: "911", isCorrect: true },
          { answerText: "112", isCorrect: false },
          { answerText: "999", isCorrect: false },
          { answerText: "000", isCorrect: false },
        ],
      },
      {
        questionText: "What do you do for a minor burn?",
        answerOptions: [
          { answerText: "Run cool water over it", isCorrect: true },
          { answerText: "Put butter on it", isCorrect: false },
          { answerText: "Put ice directly on it", isCorrect: false },
          { answerText: "Pop the blister", isCorrect: false },
        ],
      },
      {
        questionText: "What is CPR used for?",
        answerOptions: [
          {
            answerText: "When someone is not breathing/no pulse",
            isCorrect: true,
          },
          { answerText: "When someone has a broken leg", isCorrect: false },
          { answerText: "For a headache", isCorrect: false },
          { answerText: "For a stomach ache", isCorrect: false },
        ],
      },
      {
        questionText: "How do you stop severe bleeding?",
        answerOptions: [
          { answerText: "Apply direct pressure", isCorrect: true },
          { answerText: "Wash it with soap", isCorrect: false },
          { answerText: "Let it air out", isCorrect: false },
          { answerText: "Put a bandaid on it", isCorrect: false },
        ],
      },
      {
        questionText: "What are symptoms of shock?",
        answerOptions: [
          {
            answerText: "Pale, cold, clammy skin, rapid pulse",
            isCorrect: true,
          },
          { answerText: "Red face, hot skin", isCorrect: false },
          { answerText: "Sneezing and coughing", isCorrect: false },
          { answerText: "Hunger", isCorrect: false },
        ],
      },
      {
        questionText: "If someone is choking and coughing, you should:",
        answerOptions: [
          { answerText: "Encourage them to keep coughing", isCorrect: true },
          { answerText: "Hit them on the back", isCorrect: false },
          { answerText: "Perform Heimlich immediately", isCorrect: false },
          { answerText: "Give them water", isCorrect: false },
        ],
      },
      {
        questionText: "What does R.I.C.E stand for (Injuries)?",
        answerOptions: [
          { answerText: "Rest, Ice, Compression, Elevation", isCorrect: true },
          { answerText: "Run, Ice, Cry, Eat", isCorrect: false },
          { answerText: "Rice Is Cool Eating", isCorrect: false },
          { answerText: "Rest, Ignore, Care, End", isCorrect: false },
        ],
      },
      {
        questionText:
          "Should you move a person with a suspected spinal injury?",
        answerOptions: [
          {
            answerText: "No, unless they are in immediate danger",
            isCorrect: true,
          },
          { answerText: "Yes, to make them comfortable", isCorrect: false },
          { answerText: "Yes, to check their back", isCorrect: false },
          { answerText: "Yes, to drive them home", isCorrect: false },
        ],
      },
      {
        questionText: "What is a tourniquet used for?",
        answerOptions: [
          {
            answerText: "To stop life-threatening limb bleeding",
            isCorrect: true,
          },
          { answerText: "To hold an ice pack", isCorrect: false },
          { answerText: "To fix a broken bone", isCorrect: false },
          { answerText: "To tie hair back", isCorrect: false },
        ],
      },
      {
        questionText: "What is the recovery position?",
        answerOptions: [
          { answerText: "On the side, to keep airway clear", isCorrect: true },
          { answerText: "On the stomach", isCorrect: false },
          { answerText: "Sitting up", isCorrect: false },
          { answerText: "Standing", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "storm",
    title: "Storm Safety",
    description: "Hurricane, tornado, and severe thunderstorm protocols.",
    icon: "thunderstorm",
    gradient: ["#2c3e50", "#bdc3c7"],
    questions: [
      {
        questionText: "What is the safest place in a home during a tornado?",
        answerOptions: [
          { answerText: "Basement or interior room without windows", isCorrect: true },
          { answerText: "The kitchen near the fridge", isCorrect: false },
          { answerText: "Next to a large window", isCorrect: false },
          { answerText: "In the attic", isCorrect: false },
        ],
      },
      {
        questionText: "Which of these should you bring inside before a storm?",
        answerOptions: [
          { answerText: "Outdoor furniture and trash cans", isCorrect: true },
          { answerText: "The garden hose", isCorrect: false },
          { answerText: "Large trees", isCorrect: false },
          { answerText: "Nothing", isCorrect: false },
        ],
      },
      {
        questionText: "What should you do during a lightning storm?",
        answerOptions: [
          { answerText: "Stay indoors away from electronics", isCorrect: true },
          { answerText: "Go for a swim", isCorrect: false },
          { answerText: "Stand under a tall tree", isCorrect: false },
          { answerText: "Use a corded phone", isCorrect: false },
        ],
      },
      {
        questionText: "How much food should you have for a major hurricane?",
        answerOptions: [
          { answerText: "At least a 3-7 day supply", isCorrect: true },
          { answerText: "1 day's worth", isCorrect: false },
          { answerText: "Only snacks", isCorrect: false },
          { answerText: "None, help will arrive immediately", isCorrect: false },
        ],
      },
      {
        questionText: "What does a 'Severe Thunderstorm Watch' mean?",
        answerOptions: [
          { answerText: "Conditions are possible for a storm", isCorrect: true },
          { answerText: "A storm is happening right now", isCorrect: false },
          { answerText: "The storm has passed", isCorrect: false },
          { answerText: "It is safe to go outside", isCorrect: false },
        ],
      },
      {
        questionText: "If you are driving during a tornado and can't find a building, you should:",
        answerOptions: [
          { answerText: "Lie flat in a nearby ditch and cover your head", isCorrect: true },
          { answerText: "Stay in your car and duck", isCorrect: false },
          { answerText: "Try to outrun it", isCorrect: false },
          { answerText: "Hide under an overpass", isCorrect: false },
        ],
      },
      {
        questionText: "What is the 'eye' of a hurricane?",
        answerOptions: [
          { answerText: "The calm center of the storm", isCorrect: true },
          { answerText: "The most violent part", isCorrect: false },
          { answerText: "Where the rain is heaviest", isCorrect: false },
          { answerText: "A special satellite lens", isCorrect: false },
        ],
      },
      {
        questionText: "Why should you fill your bathtub with water before a hurricane?",
        answerOptions: [
          { answerText: "For flushing toilets and cleaning", isCorrect: true },
          { answerText: "To swim in", isCorrect: false },
          { answerText: "To keep the tub from floating", isCorrect: false },
          { answerText: "For drinking (unfiltered)", isCorrect: false },
        ],
      },
      {
        questionText: "Which window-prep method is actually a myth?",
        answerOptions: [
          { answerText: "Taping an 'X' on windows prevents shattering", isCorrect: true },
          { answerText: "Installing storm shutters", isCorrect: false },
          { answerText: "Using pre-cut plywood", isCorrect: false },
          { answerText: "Closing all windows firmly", isCorrect: false },
        ],
      },
      {
        questionText: "What is a 'Storm Surge'?",
        answerOptions: [
          { answerText: "An abnormal rise of water pushed by storm winds", isCorrect: true },
          { answerText: "A sudden burst of wind", isCorrect: false },
          { answerText: "The power coming back on", isCorrect: false },
          { answerText: "Heavy rain flooding a basement", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "drought",
    title: "Drought Mastery",
    description: "Test your knowledge on water conservation and dry-spell safety.",
    icon: "sunny",
    gradient: ["#F9D423", "#FF4E50"],
    questions: [
      {
        questionText: "What is 'Greywater'?",
        answerOptions: [
          { answerText: "Recycled water from sinks/showers", isCorrect: true },
          { answerText: "Water mixed with oil", isCorrect: false },
          { answerText: "Rainwater in a puddle", isCorrect: false },
          { answerText: "Saltwater", isCorrect: false },
        ],
      },
      {
        questionText: "How can you reduce water usage in the garden?",
        answerOptions: [
          { answerText: "Mulching and watering at night", isCorrect: true },
          { answerText: "Watering every hour", isCorrect: false },
          { answerText: "Using a high-pressure hose", isCorrect: false },
          { answerText: "Planting tropical flowers", isCorrect: false },
        ],
      },
      {
        questionText: "What is a common sign of a drought-stressed tree?",
        answerOptions: [
          { answerText: "Wilting or yellowing leaves", isCorrect: true },
          { answerText: "Growing faster", isCorrect: false },
          { answerText: "Turning dark green", isCorrect: false },
          { answerText: "Producing more fruit", isCorrect: false },
        ],
      },
      {
        questionText: "During a drought, you should prioritize water for:",
        answerOptions: [
          { answerText: "Human consumption and hygiene", isCorrect: true },
          { answerText: "Washing the car", isCorrect: false },
          { answerText: "Filling the pool", isCorrect: false },
          { answerText: "Hosing down the driveway", isCorrect: false },
        ],
      },
      {
        questionText: "What is 'Xeriscaping'?",
        answerOptions: [
          { answerText: "Landscaping designed for low water use", isCorrect: true },
          { answerText: "A type of deep-sea diving", isCorrect: false },
          { answerText: "Painting your lawn green", isCorrect: false },
          { answerText: "Irrigation with saltwater", isCorrect: false },
        ],
      },
      {
        questionText: "Which appliance uses the most water in a typical home?",
        answerOptions: [
          { answerText: "The toilet", isCorrect: true },
          { answerText: "The dishwasher", isCorrect: false },
          { answerText: "The kitchen sink", isCorrect: false },
          { answerText: "The coffee maker", isCorrect: false },
        ],
      },
      {
        questionText: "How does 'Mulch' help during a drought?",
        answerOptions: [
          { answerText: "It prevents evaporation from the soil", isCorrect: true },
          { answerText: "It creates water from air", isCorrect: false },
          { answerText: "It makes plants grow faster without water", isCorrect: false },
          { answerText: "It cools the air around the house", isCorrect: false },
        ],
      },
      {
        questionText: "A 'Low-Flow' showerhead typically uses how much water?",
        answerOptions: [
          { answerText: "Less than 2.0 gallons per minute", isCorrect: true },
          { answerText: "5 gallons per minute", isCorrect: false },
          { answerText: "10 gallons per minute", isCorrect: false },
          { answerText: "Whatever the pressure allows", isCorrect: false },
        ],
      },
      {
        questionText: "Why is soil compaction bad during a drought?",
        answerOptions: [
          { answerText: "It prevents what little rain falls from soaking in", isCorrect: true },
          { answerText: "It makes the ground too soft", isCorrect: false },
          { answerText: "It causes earthquakes", isCorrect: false },
          { answerText: "It attracts pests", isCorrect: false },
        ],
      },
      {
        questionText: "What is a 'Rain Barrel' used for?",
        answerOptions: [
          { answerText: "Collecting roof runoff for later use", isCorrect: true },
          { answerText: "Predicting when it will rain", isCorrect: false },
          { answerText: "Filtering water for drinking", isCorrect: false },
          { answerText: "Measuring the acidity of rain", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "epidemic",
    title: "Epidemic Protocol",
    description: "Test your knowledge on public health and infection control.",
    icon: "medical",
    gradient: ["#70E1F5", "#FFD194"],
    questions: [
      {
        questionText: "What is the recommended duration for handwashing?",
        answerOptions: [
          { answerText: "20 seconds", isCorrect: true },
          { answerText: "5 seconds", isCorrect: false },
          { answerText: "1 minute", isCorrect: false },
          { answerText: "Just a quick rinse", isCorrect: false },
        ],
      },
      {
        questionText: "Which mask type provides the highest filtration?",
        answerOptions: [
          { answerText: "N95 / KN95", isCorrect: true },
          { answerText: "Cloth mask", isCorrect: false },
          { answerText: "Bandana", isCorrect: false },
          { answerText: "Surgical mask", isCorrect: false },
        ],
      },
      {
        questionText: "Why is 'Social Distancing' important during an outbreak?",
        answerOptions: [
          { answerText: "To slow the spread of pathogens", isCorrect: true },
          { answerText: "To save on fuel", isCorrect: false },
          { answerText: "To encourage online shopping", isCorrect: false },
          { answerText: "To avoid talking to people", isCorrect: false },
        ],
      },
      {
        questionText: "What should you include in a medical isolation kit?",
        answerOptions: [
          { answerText: "Thermometer, fever meds, and hydration", isCorrect: true },
          { answerText: "A deck of cards only", isCorrect: false },
          { answerText: "Just soap", isCorrect: false },
          { answerText: "Nothing special", isCorrect: false },
        ],
      },
      {
        questionText: "What is 'Herd Immunity'?",
        answerOptions: [
          { answerText: "When enough people are immune to stop spread", isCorrect: true },
          { answerText: "When everyone stays in a group", isCorrect: false },
          { answerText: "A type of livestock disease", isCorrect: false },
          { answerText: "Resistance to all diseases ever", isCorrect: false },
        ],
      },
      {
        questionText: "How is 'Quarantine' different from 'Isolation'?",
        answerOptions: [
          { answerText: "Quarantine is for exposed; Isolation is for sick", isCorrect: true },
          { answerText: "They are exact synonyms", isCorrect: false },
          { answerText: "Isolation is only for hospitals", isCorrect: false },
          { answerText: "Quarantine means you can't leave your city", isCorrect: false },
        ],
      },
      {
        questionText: "What is the 'R-naught' (R0) value?",
        answerOptions: [
          { answerText: "The average number of people one person infects", isCorrect: true },
          { answerText: "The time it takes to recover", isCorrect: false },
          { answerText: "The mortality rate of a virus", isCorrect: false },
          { answerText: "The distance a sneeze travels", isCorrect: false },
        ],
      },
      {
        questionText: "Which surfaces are considered 'High-Touch' for disinfecting?",
        answerOptions: [
          { answerText: "Doorknobs, light switches, and phones", isCorrect: true },
          { answerText: "Ceilings and top shelves", isCorrect: false },
          { answerText: "Inside the refrigerator", isCorrect: false },
          { answerText: "Carpets and curtains", isCorrect: false },
        ],
      },
      {
        questionText: "When using hand sanitizer, it should contain at least:",
        answerOptions: [
          { answerText: "60% alcohol", isCorrect: true },
          { answerText: "10% alcohol", isCorrect: false },
          { answerText: "99% bleach", isCorrect: false },
          { answerText: "Fragrance and glitter", isCorrect: false },
        ],
      },
      {
        questionText: "What is the primary way respiratory viruses spread?",
        answerOptions: [
          { answerText: "Small droplets from coughing or sneezing", isCorrect: true },
          { answerText: "Through contaminated groundwater", isCorrect: false },
          { answerText: "By looking at someone unwell", isCorrect: false },
          { answerText: "Only through direct blood contact", isCorrect: false },
        ],
      },
    ],
  },
];
