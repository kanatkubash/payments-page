var data = {
  invoices: [
    {
      id: 1,
      ocr: "5156778000534",
      invoiceNumber: "DD8020",
      consumer: "ADESA Europe BV",
      licensePlate: "YBX71E",
      payDate: new Date("2021-11-01"),
      payAmount: 302310,
    },
    {
      id: 2,
      ocr: "5157401000537",
      invoiceNumber: "DD8017",
      consumer: "ADESA Europe BV",
      licensePlate: "ZDG583",
      payDate: new Date("2021-11-01"),
      payAmount: 226710,
    },
    {
      id: 3,
      ocr: "5156536000537",
      invoiceNumber: "DD8019",
      consumer: "ADESA Europe BV",
      licensePlate: "DAS95U",
      payDate: new Date("2021-11-01"),
      payAmount: 279750,
    },
    {
      id: 4,
      ocr: "5157196000833",
      invoiceNumber: "B19065",
      consumer: "Derome Byggvaror och Träteknik AB",
      licensePlate: "PGF983",
      payDate: new Date("2021-11-09"),
      payAmount: 8438,
    },
    {
      id: 5,
      ocr: "5156535000835",
      invoiceNumber: "B19047",
      consumer: "APQ EL AB",
      licensePlate: "KPW540",
      payDate: new Date("2021-11-08"),
      payAmount: 8334,
    },
    {
      id: 6,
      ocr: "5157080000337",
      invoiceNumber: "D16340",
      consumer: "Kamux AB",
      licensePlate: "WGG142",
      payDate: new Date("2021-11-09"),
      payAmount: 209300,
    },
    {
      id: 7,
      ocr: "5157059001431",
      invoiceNumber: "F4011",
      consumer: "Elite Nordic Motors AB",
      licensePlate: "NKZ534",
      payDate: new Date("2021-11-25"),
      payAmount: 0,
    },
    {
      id: 8,
      ocr: "5156303000231",
      invoiceNumber: "79290",
      consumer: "Hedin Mölndal Bil AB Nacka",
      licensePlate: "YRA617",
      payDate: new Date("2021-10-18"),
      payAmount: 3625,
    },
    {
      id: 9,
      ocr: "5156871000233",
      invoiceNumber: "79508",
      consumer: "Skobes Bil Mitt AB",
      licensePlate: "WKD18R",
      payDate: new Date("2021-10-26"),
      payAmount: 3625,
    },
    {
      id: 10,
      ocr: "5156617000232",
      invoiceNumber: "79525",
      consumer: "Forsan Bil AB",
      licensePlate: "LAW645",
      payDate: new Date("2021-10-26"),
      payAmount: 3625,
    },
  ],
  verificationGroups: [
    {
      id: 1,
      value: 1,
    },
    {
      id: 2,
      value: -1,
    },
  ],
  verificationGroupEntries: [
    {
      groupId: 1,
      verificationId: 1,
      type: "invoice",
    },
    {
      groupId: 1,
      verificationId: 2,
      type: "invoice",
    },
    {
      groupId: 1,
      verificationId: 1002,
      type: "payment",
    },
    {
      groupId: 2,
      verificationId: 3,
      type: "invoice",
    },
    {
      groupId: 2,
      verificationId: 1003,
      type: "payment",
    },
  ],
  payments: [
    {
      id: 1001,
      ocr: "JEW025",
      payDate: new Date("2021-06-08"),
      payAmount: -810050,
      company: "VOLKSWAGEN FINANS SVERIGE AB, 15188, SÖDERTÄLJE",
      transactionId: "20210608-497081523674",
    },
    {
      id: 1002,
      ocr: null,
      payDate: new Date("2021-06-08"),
      payAmount: -529021,
      company: null,
      transactionId: "7b304e52-46e3-11ec-81d3-0242ac130003",
    },
    {
      id: 1003,
      ocr: null,
      payDate: new Date("2021-06-08"),
      payAmount: -279749,
      company: null,
      transactionId: "4f008610-46ef-11ec-81d3-0242ac130003",
    },
    {
      id: 1004,
      ocr: null,
      payDate: new Date("2021-06-08"),
      payAmount: -1,
      company: "to merge with verification",
      transactionId: "8a0c21c5-1b5f-4a47-84e2-49a03d2b757c",
    },
    {
      id: 1005,
      ocr: null,
      payDate: new Date("2021-06-08"),
      payAmount: -209300,
      company: "to merge with invoice",
      transactionId: "8a0c21c5-1b5f-4a47-84e2-49a03d2b757c",
    },
  ],
};
