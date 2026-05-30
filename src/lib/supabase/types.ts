// Hand-authored to match supabase/migrations/* (Plan 1 scope).
// Regenerate from the live cloud schema with:
//   pnpm supabase gen types typescript --linked > src/lib/supabase/types.ts
// once `pnpm supabase link` is configured.

export type Kind = "income" | "expense"
export type LocaleCode = "zh-CN" | "en"

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          i18n_key: string | null
          kind: Kind
          icon: string | null
          color: string | null
          is_archived: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          i18n_key?: string | null
          kind: Kind
          icon?: string | null
          color?: string | null
          is_archived?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          i18n_key?: string | null
          kind?: Kind
          icon?: string | null
          color?: string | null
          is_archived?: boolean
          created_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          category_id: string
          kind: Kind
          amount: number
          currency: string
          occurred_on: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          kind: Kind
          amount: number
          currency?: string
          occurred_on?: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          kind?: Kind
          amount?: number
          currency?: string
          occurred_on?: string
          note?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      preferences: {
        Row: {
          user_id: string
          currency: string
          locale: LocaleCode
          default_view: string
          created_at: string
        }
        Insert: {
          user_id: string
          currency?: string
          locale?: LocaleCode
          default_view?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          currency?: string
          locale?: LocaleCode
          default_view?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
