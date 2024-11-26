export type SupabaseUserCallback = {
  type: 'UPDATE' | 'INSERT' | 'DELETE';
  table: string;
  record: {
    id: string;
    email: string;
    phone: string;
    encrypted_password: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    raw_app_meta_data: {
      provider: string;
      providers: string[];
      user_type: string;
    };
    raw_user_meta_data: {
      name: string;
      first_name: string;
      last_name: string;
    };
  };
};
