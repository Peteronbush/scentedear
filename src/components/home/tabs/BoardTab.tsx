"use client";

import { useState } from "react";

type Category = "전체" | "추천" | "리뷰" | "질문" | "정보" | "잡담";

const CATEGORIES: Category[] = ["전체", "추천", "리뷰", "질문", "정보", "잡담"];

const CATEGORY_COLOR: Record<string, string> = {
  추천: "bg-amber-100 text-amber-700",
  리뷰: "bg-violet-100 text-violet-700",
  질문: "bg-sky-100 text-sky-700",
  정보: "bg-emerald-100 text-emerald-700",
  잡담: "bg-stone-100 text-stone-600",
};

// Mock posts
const MOCK_POSTS = [
  { id: 1, category: "리뷰", title: "Baccarat Rouge 540 첫 인상", body: "드디어 BR540을 써봤어요. 달콤하고 우디한 향이 정말 독보적이에요.", author: "향수덕후", fragrance: "Baccarat Rouge 540", likes: 24, comments: 8, time: "2시간 전" },
  { id: 2, category: "추천", title: "봄 데일리 향수 추천해주세요", body: "봄에 어울리는 가볍고 플로럴한 향수 찾고 있어요. 예산은 15만원 이내로요.", author: "플로럴러버", fragrance: null, likes: 15, comments: 12, time: "4시간 전" },
  { id: 3, category: "정보", title: "Nishane 하우스 소개", body: "터키 이스탄불에서 시작한 니시아네는 동서양을 아우르는 독특한 향수로 유명해요.", author: "우디마니아", fragrance: null, likes: 31, comments: 5, time: "1일 전" },
  { id: 4, category: "잡담", title: "향수 보관 어떻게 하세요?", body: "직사광선 피해서 서랍 안에 넣어두는데 다들 어떻게 보관하시나요?", author: "씨트러스킹", fragrance: null, likes: 9, comments: 17, time: "1일 전" },
  { id: 5, category: "리뷰", title: "Oud Wood - 겨울에 딱", body: "Tom Ford의 Oud Wood를 겨울 내내 뿌렸어요. 우디하고 따뜻한 느낌이 추위를 이겨내게 해줘요.", author: "향수덕후", fragrance: "Oud Wood", likes: 18, comments: 3, time: "2일 전" },
];

export default function BoardTab() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

  const filtered = MOCK_POSTS.filter(
    (p) => selectedCategory === "전체" || p.category === selectedCategory
  );

  return (
    <div className="pb-6">
      {/* Category filter */}
      <div className="sticky top-0 bg-stone-50 z-10 px-5 pt-4 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-stone-800 text-white"
                  : "bg-white border border-stone-200 text-stone-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Post list */}
      <div className="px-5 space-y-3">
        {filtered.map((post) => (
          <button
            key={post.id}
            className="w-full bg-white rounded-2xl px-4 py-4 border border-stone-100 shadow-sm text-left hover:border-amber-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLOR[post.category]}`}>
                {post.category}
              </span>
              <span className="text-[10px] text-stone-300 shrink-0">{post.time}</span>
            </div>
            <p className="font-semibold text-stone-800 text-sm mb-1">{post.title}</p>
            <p className="text-xs text-stone-400 line-clamp-2 mb-3">{post.body}</p>
            {post.fragrance && (
              <span className="inline-block text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100 mb-2">
                🌸 {post.fragrance}
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">{post.author}</span>
              <div className="flex gap-3 text-xs text-stone-400">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          </button>
        ))}

        {/* Write button */}
        <button className="w-full py-3.5 rounded-2xl border-2 border-dashed border-stone-200 text-stone-400 text-sm hover:border-amber-300 hover:text-amber-500 transition-colors">
          + 글 작성하기
        </button>
      </div>
    </div>
  );
}
