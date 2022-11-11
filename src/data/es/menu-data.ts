import { serloDomain } from '../../helper/urls/serlo-domain'
import { FooterIcon, InstanceData, LandingSubjectsData } from '@/data-types'

export const landingSubjectsData: LandingSubjectsData = {
  subjects: [
    { url: '/169578', title: 'Aprender matemáticas', icon: 'math' },
    {
      url: '/241982',
      title: 'Sostenibilidad aplicada',
      icon: 'sustainability',
    },
    {
      url: '/229701/estudios-en-diásporas-africanas-para-la-escuela',
      title: 'Diásporas Africanas',
      icon: 'geography',
    },
  ],
  additionalLinks: [
    {
      url: '/195616/p%C3%A1gina-de-inicio-para-padres',
      title: 'Información para los padres',
    },
    {
      url: '/195618/p%C3%A1gina-de-inicio-para-docentes',
      title: 'Información para docentes',
    },
  ],
}

export const headerData: InstanceData['headerData'] = [
  {
    url: '',
    title: 'Temas',
    icon: 'subject',
    children: [
      { url: '/169578', title: 'Matemáticas' },
      { url: '/241982', title: 'Sostenibilidad aplicada' },
      { url: '/229701', title: 'Estudios en Diásporas Africanas' },
      { url: '/community/sandbox', title: 'Test Area' },
    ],
  },
  { url: '/serlo', title: 'Sobre Serlo', icon: 'about' },
  { url: '/participa', title: '¡Participa!', icon: 'participate' },
  {
    url: '',
    title: 'Comunidad',
    icon: 'community',
    children: [
      {
        url: '/community',
        title: 'Página para autores',
      },
      { url: 'https://community.serlo.org/', title: 'Chat para autores' },
      { url: '/170539', title: 'Páginas de ayuda' },
      { url: '/entity/unrevised', title: 'Cambios en revisión' },
      { url: '/discussions', title: 'Todos los comentarios' },
    ],
  },
]

export const footerData: InstanceData['footerData'] = {
  footerNavigation: [
    {
      title: 'Configuración General',
      children: [
        { title: 'A cerca de Serlo', url: '/serlo' },
        { title: '¡Participa!', url: '/participa' },
        { title: 'Contactanos', url: '/181414' },
        {
          title: 'Serlo en otros idiomas',
          url: `https://en.${serloDomain}/global`,
        },
        {
          title: 'API',
          url: `https://en.${serloDomain}/community/technology-and-development/content-api`,
        },
      ],
    },
    {
      title: 'Mantente en contacto',
      children: [
        {
          title: 'GitHub',
          url: 'https://github.com/serlo',
          icon: FooterIcon.github,
        },
      ],
    },
    {
      title: 'Términos legales',
      children: [
        {
          title: 'Politica de privacidad',
          url: `https://es.${serloDomain}/privacy`,
        },
        {
          title: 'Revoke consent',
          url: `/consent`,
        },
        {
          title: 'Términos legales',
          url: `https://es.${serloDomain}/terms`,
        },
        { title: 'Imprint', url: `https://es.${serloDomain}/imprint` },
      ],
    },
  ],
  aboutHref: '/serlo',
  participationHref: '/participa',
  donationHref: '/spenden',
}

export const secondaryMenus: InstanceData['secondaryMenus'] = [
  {
    // subject: 'estudios en diásporas africanas para la escuela',
    rootId: 229701,
    entries: [
      { title: 'Todos los temas', id: 242308 },
      { title: '¿Eres nuevo aquí?', id: 180775 },
    ],
  },
  {
    // subject: 'sostenibilidad aplicada',
    rootId: 242851,
    entries: [{ title: '¿Eres nuevo aquí?', id: 180775 }],
  },
  {
    // subject: "matemáticas'",
    rootId: 169578,
    entries: [
      { title: 'Todos los temas', id: 169580 },
      { title: ' ¿Eres nuevo aquí?', id: 180775 },
    ],
  },
  {
    // comunidad
    rootId: 112258,
    entries: [
      { title: 'Páginas de ayuda', id: 170539 },
      { title: ' Recursos para educadores', id: 182103 },
      { title: 'Test Area', id: 164237 },
      { title: 'Todas las actividades', url: '/event/history' },
      { title: 'Todos los comentarios', url: '/discussions' },
      { title: 'Operaciones en revisión', url: '/entity/unrevised' },
    ],
  },
  {
    // about serlo
    entries: [
      { title: 'A cerca de Serlo', id: 112249 },
      { title: 'Así funciona la plataforma de aprendizaje', id: 195620 },
      { title: 'Concepto pedagógico', id: 170419 },
      { title: 'Equipo', id: 181476 },
      { title: 'Socios y Patrocinadores', id: 198326 },
      { title: 'Impacto', id: 209934 },
      { title: 'Transparencia', id: 209929 },
    ],
  },
  {
    // get involved
    entries: [
      { title: 'Participa', id: 112252 },
      { title: 'Contacto y ubicación', id: 181414 },
    ],
  },
]
