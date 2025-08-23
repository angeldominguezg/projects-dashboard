import { SupabaseClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

// Interfaces reutilizables para tipar los datos de Supabase
export interface Client {
  id: string;
  name: string;
  // ... cualquier otro campo de la tabla de clientes
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  description: string;
  created_at: string;
  icon?: string;
  clients: Client | null; // Objeto del cliente anidado
  tasks: any[]; // TODO: Definir una interfaz Task apropiada
}

// --- Funciones para obtener datos ---

/**
 * Obtiene todos los proyectos.
 * @param supabase - Una instancia del cliente de Supabase.
 */
export async function getProjects(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Error fetching projects:", error.message);
    throw new Error("Projects data could not be loaded");
  }
  return data || [];
}

/**
 * Obtiene solo los proyectos anclados.
 * @param supabase - Una instancia del cliente de Supabase.
 */
export async function getPinnedProjects(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_pinned", true);

  if (error) {
    console.error("Error fetching pinned projects:", error.message);
    throw new Error("Pinned projects data could not be loaded");
  }
  return data || [];
}

/**
 * Obtiene un único proyecto por su slug.
 * @param supabase - Una instancia del cliente de Supabase (de servidor o cliente).
 * @param slug - El slug del proyecto a obtener.
 */
export async function getProjectBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(`*, clients(*), tasks(*)`)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching project:", error.message);
    // Esto activará la página not-found.tsx de Next.js para una mejor UX
    notFound();
  }
  return data;
}
