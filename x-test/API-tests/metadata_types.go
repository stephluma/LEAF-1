package main

type Orgchart_employee_md struct {
	Name         string  `json:"Name"`
	Email        string  `json:"Email"`
	Title        string  `json:"Title"`
	UserID       string  `json:"UserID"`
}

//not currently used, but want to make sure metadata structs are set up to potentially take different types
type Save_Format_md struct {
	Save_Format  string  `json:"save_format"`
}

type Metadata struct {
	Orgchart_employee          Orgchart_employee_md  `json:"orgchart_employee,omitempty"`
	Save_Format                Save_Format_md        `json:"save_format,omitempty"`
}