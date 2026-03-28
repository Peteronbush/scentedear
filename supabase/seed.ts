/**
 * Scentedeer — Supabase seed script
 *
 * Usage:
 *   npx ts-node --project tsconfig.seed.json supabase/seed.ts
 *
 * Env vars required (.env.local or shell):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   ← NOT the anon key
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

// ── Helpers ──────────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += line[i];
    }
  }
  fields.push(current.trim().replace(/\r$/, ""));
  return fields;
}

function toArray(val: string): string[] {
  if (!val || val.trim() === "") return [];
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}

function toInt(val: string): number | null {
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

function toFloat(val: string): number | null {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

// ── Parse CSV ────────────────────────────────────────────────

const CSV_PATH = path.join(__dirname, "..", "data", "fragrances_enriched.csv");
const raw = fs.readFileSync(CSV_PATH, "utf8").replace(/^\uFEFF/, ""); // strip BOM
const lines = raw.trim().split("\n");

const rows = lines.slice(1).map((line) => {
  const [
    id, name, house, concentration, gender, family,
    top_notes, middle_notes, base_notes, year,
    description_ko, longevity_avg, projection_avg, rating_avg,
    accords, keywords_ko, season, occasion,
    intensity, warmth, sweetness, popularity, price_tier,
  ] = parseCSVLine(line);

  return {
    id:             toInt(id),
    name,
    house,
    concentration:  concentration || null,
    gender:         gender || null,
    family:         family || null,
    top_notes:      toArray(top_notes),
    middle_notes:   toArray(middle_notes),
    base_notes:     toArray(base_notes),
    year:           toInt(year),
    description_ko: description_ko || null,
    longevity_avg:  toFloat(longevity_avg),
    projection_avg: toFloat(projection_avg),
    rating_avg:     toFloat(rating_avg),
    accords:        toArray(accords),
    keywords_ko:    toArray(keywords_ko),
    season:         toArray(season),
    occasion:       toArray(occasion),
    intensity:      toInt(intensity),
    warmth:         toInt(warmth),
    sweetness:      toInt(sweetness),
    popularity:     toInt(popularity),
    price_tier:     price_tier || null,
  };
});

// ── Supabase client (service role — never expose to browser) ──

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    "Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

// ── Batch upsert ─────────────────────────────────────────────

const BATCH = 50;

async function seed() {
  console.log(`Seeding ${rows.length} fragrances in batches of ${BATCH}…`);
  let total = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase
      .from("fragrances")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`Batch ${i / BATCH + 1} failed:`, error.message);
      process.exit(1);
    }
    total += batch.length;
    console.log(`  ✓ ${total}/${rows.length}`);
  }

  console.log(`\nDone — imported ${total} rows.`);
}

seed();
