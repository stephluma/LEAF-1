package main

type Orgchart_employee_md struct {
	Name         string  `json:"name"`
	Email        string  `json:"email"`
	Title        string  `json:"title"`
	EmpUID       string  `json:"empUID"`
	NatEmpUID    string  `json:"natEmpUID"`
}

type Save_Format_md struct {
	Save_Format  string  `json:"save_format"`
}

type Metadata struct {
	Orgchart_employee          Orgchart_employee_md  `json:"orgchart_employee"`
	Save_Format                Save_Format_md        `json:"save_format,omitempty"`
}