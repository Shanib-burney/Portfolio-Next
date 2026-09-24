export type Education = {
  degree: string;
  institution: string;
  period: string;
  note?: string;
};

export const education: Education[] = [
  {
    degree: "Master of Science, Data Science",
    institution: "NED University of Engineering & Technology, Karachi",
    period: "2024 – present",
    note: "Research: multimodal image captioning benchmark, COVID-19 prediction",
  },
  {
    degree: "Bachelor of Science, Software Engineering",
    institution: "UBIT, University of Karachi",
    period: "2018 – 2021",
    note: "CGPA 3.25 / 4",
  },
];
