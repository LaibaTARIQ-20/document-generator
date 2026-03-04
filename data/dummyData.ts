export interface Member {
  id: number
  name: string
  photo: string
  active: boolean
}

export interface Supervisor {
  name: string
  degree: string
  university: string
  discipline: string
  specialization: string
  photo: string
  active: boolean
}

export interface ProjectData {
  title: string
  sdgs: string[]
  groupMembers: Member[]
  supervisor: Supervisor
  coSupervisor: Supervisor
  abstract: string
  diagram: string
}

const projectData: ProjectData = {

  title: "Blockchain based Internet Voting",

  sdgs: [
    "SDG 3: Good health and well-being"
  ],

  groupMembers: [
    {
      id: 1,
      name: "Shaiq e Mustafa",
      photo: "/photos/image.png",
      active:true
    },
     {
      id: 2,
      name: "Mutti ur Rehman",
      photo: "/photos/image4.png",
      active:true
    },
 
    {
      id: 3,
      name: "Farhad Farhad Farhad Farhad Gul",
      photo: "/photos/image1.png",
      active: true
    },
    {
      id: 4,
      name: "Syed Own",
      photo: "/photos/image2.png",
      active: true
    },
  ],

  supervisor: {
    name: "Dr Usman Akram",
    degree: "PhD",
    university: "National University of Science and Technology",
    discipline: "Computer Engineering",
    specialization: "Medical Image / Signal Analysis",
    photo: "/photos/image3.png",
    active: true
  },

  coSupervisor: {
    name: "Dr Sajid Gul Khawaja",
    degree: "PhD",
    university: "National University of Science and Technology",
    discipline: "Computer Engineering",
    specialization: "Digital System Design",
    photo: "/photos/image5.png",
    active: true
  },

  abstract: `Internet voting is a crucial requirement given the current
situation of the voting process worldwide. Block chains can allow for
an immutable exchange of data between a central authority and individual
nodes. Each constituency is modelled as a node, and is directly channeled
with a central authority. The blockchain technology used in the project is
Hyperledger Fabric. Fabric, being a permissioned blockchain allows greater
control over the transfer and committal of data. This along with a
cross-platform flutter based mobile app for the actual voting process,
and a website to display the votes helps to create a safe and reliable
voting mechanism that fights off voter coercion and can boast being
verifiable.`,

  diagram: "/diagram/flowchart.png"

}

export default projectData