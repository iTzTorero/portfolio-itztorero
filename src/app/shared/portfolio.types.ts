export type LocalizedText = { en: string; es: string };
export type LocalizedList = { en: string[]; es: string[] };

export type ProjectProduct = {
  name: string;
  type: LocalizedText;
  description: LocalizedText;
};

export type ProjectOwnership =
  | 'client'        // trabajo bajo contrato para un cliente (VALC Tech)
  | 'employer'      // trabajo como empleado (Monteli LLC)
  | 'product-live'  // producto propio en producción
  | 'product-dev'   // producto propio en desarrollo
  | 'research';     // plataforma de investigación (tesis)

export type ProjectCategory = 'saas' | 'ai' | 'data' | 'mobile' | 'custom';

export type Project = {
  slug: string;

  name: LocalizedText;
  summary: LocalizedText;
  /** Meta description <=155 chars para SEO; el summary completo es demasiado largo. */
  metaDescription?: LocalizedText;
  /** Estado visible del proyecto (chip en tarjeta y detalle). */
  status?: LocalizedText;
  /** Categorías curadas para los filtros de /projects. */
  categories?: ProjectCategory[];

  stack: string[];
  tags?: string[];

  ownership?: ProjectOwnership;
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
