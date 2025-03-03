export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: string
          user_id: string
          type: 'link' | 'note'
          title: string
          url: string | null
          content: string | null
          image_url: string | null
          is_saved: boolean
          is_shared: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'link' | 'note'
          title: string
          url?: string | null
          content?: string | null
          image_url?: string | null
          is_saved?: boolean
          is_shared?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'link' | 'note'
          title?: string
          url?: string | null
          content?: string | null
          image_url?: string | null
          is_saved?: boolean
          is_shared?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shared_items: {
        Row: {
          id: string
          item_id: string
          shared_by: string
          shared_with: string
          shared_at: string
        }
        Insert: {
          id?: string
          item_id: string
          shared_by: string
          shared_with: string
          shared_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          shared_by?: string
          shared_with?: string
          shared_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}