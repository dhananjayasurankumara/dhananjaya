import { groq } from 'next-sanity'

export const heroQuery = groq`*[_type == "hero"][0]`
export const aboutQuery = groq`*[_type == "about"][0]`
export const projectsQuery = groq`*[_type == "project"]`
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`
