/** 공백·특수문자 제거 후 소문자화 — 붙여쓰기 검색 지원 */
export const normalize = (str: string) =>
  str.toLowerCase()
     .replace(/\s+/g, '')
     .replace(/['\-\.&]/g, '');

/** 향수 객체가 쿼리와 일치하는지 확인 */
export const matchesFragrance = (
  f: {
    name: string;
    house: string;
    nameKo?: string | null;
    nameAliases?: string[];
    houseKo?: string | null;
    houseAliases?: string[];
  },
  query: string
) => {
  const q = normalize(query);
  if (!q) return false;
  return (
    normalize(f.name).includes(q) ||
    normalize(f.house).includes(q) ||
    (f.nameKo ? normalize(f.nameKo).includes(q) : false) ||
    (f.houseKo ? normalize(f.houseKo).includes(q) : false) ||
    (f.nameAliases ?? []).some((a) => normalize(a).includes(q)) ||
    (f.houseAliases ?? []).some((a) => normalize(a).includes(q))
  );
};

/** 하우스/유저 등 단순 문자열 매칭 */
export const matchesString = (str: string, query: string) =>
  normalize(str).includes(normalize(query));
