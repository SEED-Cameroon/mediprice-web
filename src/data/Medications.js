const medications = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description:
      "Paracetamol is commonly used to relieve pain and reduce fever.",
    category: "Pain relief",
    price: "500 FCFA",
    trust: "SEED-verified",
    providers: [
      {
        id: 1,
        name: "Provider A",
        price: "500 FCFA",
        trust: "SEED-verified",
        updatedAt: "Today",
      },
      {
        id: 2,
        name: "Provider B",
        price: "600 FCFA",
        trust: "Provider-verified",
        updatedAt: "Yesterday",
      },
    ],
  },

  {
    id: 2,
    name: "Amoxicillin 500mg",
    description:
      "Amoxicillin is an antibiotic used to treat certain bacterial infections.",
    category: "Antibiotic",
    price: "1,500 FCFA",
    trust: "Provider-verified",
    providers: [
      {
        id: 1,
        name: "Provider A",
        price: "1,500 FCFA",
        trust: "Provider-verified",
        updatedAt: "Today",
      },
      {
        id: 2,
        name: "Provider C",
        price: "1,700 FCFA",
        trust: "Community-reported",
        updatedAt: "2 days ago",
      },
    ],
  },

  {
    id: 3,
    name: "Ibuprofen 400mg",
    description:
      "Ibuprofen is used to relieve pain, reduce fever, and decrease inflammation.",
    category: "Pain relief",
    price: "800 FCFA",
    trust: "Community-reported",
    providers: [
      {
        id: 1,
        name: "Provider B",
        price: "800 FCFA",
        trust: "Provider-verified",
        updatedAt: "Today",
      },
      {
        id: 2,
        name: "Provider C",
        price: "900 FCFA",
        trust: "Community-reported",
        updatedAt: "Yesterday",
      },
    ],
  },

  {
    id: 4,
    name: "Artemether/Lumefantrine",
    description:
      "An antimalarial medicine used to treat uncomplicated malaria.",
    category: "Antimalarial",
    price: "2,000 FCFA",
    trust: "SEED-verified",
    providers: [
      {
        id: 1,
        name: "Provider A",
        price: "2,000 FCFA",
        trust: "SEED-verified",
        updatedAt: "Today",
      },
      {
        id: 2,
        name: "Provider B",
        price: "2,200 FCFA",
        trust: "Provider-verified",
        updatedAt: "Yesterday",
      },
    ],
  },
];

export default medications;