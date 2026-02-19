
export type ChangePasswordType = {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export type ActivityType = {
	completed_count: number
	total_duration: string
	uncompleted_count: number
}

export type ActivityResponse = {
	data: ActivityType
}