export type LocalizedText = { en: string; es: string };
export type LocalizedList = { en: string[]; es: string[] };

export type ProjectProduct = {
  name: string;
  type: LocalizedText;
  description: LocalizedText;
};

export type Project = {
  slug: string;

  name: LocalizedText;
  summary: LocalizedText;

  stack: string[];
  tags?: string[];

  ownership?: 'personal' | 'professional';
  role?: LocalizedText;

  confidentiality?: LocalizedText;
  disclaimer?: LocalizedText;

  products?: ProjectProduct[];

  impact?: LocalizedList;
  highlights?: LocalizedList;
  architecture?: LocalizedList;

  github?: string;
  demo?: string;
};
