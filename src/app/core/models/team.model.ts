export interface Team {
  id: number;
  name: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id: number;
  username: string;
  role: string;
}

export interface CreateTeamDto {
  name: string;
}

export interface AssignMemberDto {
  teamId: number;
  userId: number;
}
