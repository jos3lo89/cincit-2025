import { UserPlus, Home, NotebookTabs, Bot } from "lucide-react";

export const organization = {
  name: "Cincit",
  description: "Edición 2025",
  logo: "/robot.webp",
};

export const sideBarData = {
  teams: {
    name: "Cincit",
    description: "Edición 2025",
    logo: "/robot.webp",
  },
  navMain: {
    ADMINISTRATOR: [
      {
        title: "Inicio",
        url: "/",
        icon: Home,
      },
      {
        title: "Asistencia",
        url: "#",
        icon: UserPlus,
        isActive: true,
        items: [
          {
            title: "Llamar lista",
            url: "/attendance/call",
          },
          {
            title: "Control de asistencia",
            url: "/attendance/control",
          },
          {
            title: "Crear asistencia",
            url: "/attendance/create",
          },
        ],
      },
      {
        title: "Inscripciones",
        url: "#",
        icon: UserPlus,
        isActive: true,
        items: [
          {
            title: "Buscar",
            url: "/inscription/search",
          },
          {
            title: "Todos",
            url: "/inscription/all",
          },
          {
            title: "Pendientes",
            url: "/inscription/pending",
          },
          {
            title: "Aprovados",
            url: "/inscription/approved",
          },
          {
            title: "Rechazados",
            url: "/inscription/rejected",
          },
        ],
      },
      {
        title: "Reportes",
        url: "#",
        icon: NotebookTabs,
        items: [
          {
            title: "Reporticitos",
            url: "/report",
          },
        ],
      },
      {
        title: "Usuarios",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Cambiar rol",
            url: "/user/change-role",
          },
        ],
      },
    ],

    INSCRIBER: [
      {
        title: "Inicio",
        url: "/",
        icon: Home,
      },
      {
        title: "Asistencia",
        url: "#",
        icon: UserPlus,
        isActive: true,
        items: [
          {
            title: "Llamar lista",
            url: "/attendance/call",
          },
        ],
      },
      {
        title: "Inscripciones",
        url: "#",
        icon: UserPlus,
        items: [
          {
            title: "Todos",
            url: "/inscription/all",
          },
          {
            title: "Pendientes",
            url: "/inscription/pending",
          },
          {
            title: "Aprovados",
            url: "/inscriptions/approved",
          },
          {
            title: "Rechazados",
            url: "/inscription/rejected",
          },
        ],
      },
    ],

    PARTICIPANT: [
      {
        title: "Página Principal",
        url: "/",
        icon: Home,
      },
    ],

    STAFF: [
      {
        title: "Página Principal",
        url: "/",
        icon: Home,
      },
    ],
  },
};
