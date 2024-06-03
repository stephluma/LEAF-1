package main

import (
	"encoding/json"
	"io"
	"net/url"
	"strconv"
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestForm_Version(t *testing.T) {
	got, _ := httpGet(RootURL + "api/form/version")
	want := `"1"`

	if !cmp.Equal(got, want) {
		t.Errorf("form version = %v, want = %v", got, want)
	}
}

func TestForm_AdminCanEditData(t *testing.T) {
	postData := url.Values{}
	postData.Set("CSRFToken", CsrfToken)
	postData.Set("3", "12345")

	res, _ := client.PostForm(RootURL+`api/form/505`, postData)
	bodyBytes, _ := io.ReadAll(res.Body)
	got := string(bodyBytes)
	want := `"1"`

	if !cmp.Equal(got, want) {
		t.Errorf("Admin got = %v, want = %v", got, want)
	}
}

func TestForm_NonadminCannotEditData(t *testing.T) {
	postData := url.Values{}
	postData.Set("CSRFToken", CsrfToken)
	postData.Set("3", "12345")

	res, _ := client.PostForm(RootURL+`api/form/505?masquerade=nonAdmin`, postData)
	bodyBytes, _ := io.ReadAll(res.Body)
	got := string(bodyBytes)
	want := `"0"`

	if !cmp.Equal(got, want) {
		t.Errorf("Non-admin got = %v, want = %v", got, want)
	}
}

func TestForm_NeedToKnowDataReadAccess(t *testing.T) {
	got, res := httpGet(RootURL + "api/form/505/data?masquerade=nonAdmin")
	if !cmp.Equal(res.StatusCode, 200) {
		t.Errorf("./api/form/505/data?masquerade=nonAdmin Status Code = %v, want = %v", res.StatusCode, 200)
	}
	want := `[]`
	if !cmp.Equal(got, want) {
		t.Errorf("Non-admin, non actor should not have read access to need to know record. got = %v, want = %v", got, want)
	}
}

func TestForm_RequestFollowupAllowCaseInsensitiveUserID(t *testing.T) {
	postData := url.Values{}
	postData.Set("CSRFToken", CsrfToken)
	postData.Set("3", "12345")

	res, _ := client.PostForm(RootURL+`api/form/7?masquerade=nonAdmin`, postData)
	bodyBytes, _ := io.ReadAll(res.Body)
	got := string(bodyBytes)
	want := `"1"`

	if !cmp.Equal(got, want) {
		t.Errorf("Non-admin got = %v, want = %v", got, want)
	}
}

func TestForm_WorkflowIndicatorAssigned(t *testing.T) {
	got, res := httpGet(RootURL + "api/form/508/workflow/indicator/assigned")

	if !cmp.Equal(res.StatusCode, 200) {
		t.Errorf("./api/form/508/workflow/indicator/assigned Status Code = %v, want = %v", res.StatusCode, 200)
	}

	want := `[]`
	if !cmp.Equal(got, want) {
		t.Errorf("./api/form/508/workflow/indicator/assigned = %v, want = %v", got, want)
	}
}

func TestForm_IsMaskable(t *testing.T) {
	res, _ := httpGet(RootURL + "api/form/_form_ce46b")

	var m FormCategoryResponse
	err := json.Unmarshal([]byte(res), &m)
	if err != nil {
		t.Error(err)
	}

	if m[0].IsMaskable != nil {
		t.Errorf("./api/form/_form_ce46b isMaskable = %v, want = %v", m[0].IsMaskable, nil)
	}

	res, _ = httpGet(RootURL + "api/form/_form_ce46b?context=formEditor")

	err = json.Unmarshal([]byte(res), &m)
	if err != nil {
		t.Error(err)
	}

	if *m[0].IsMaskable != 0 {
		t.Errorf("./api/form/_form_ce46b?context=formEditor isMaskable = %v, want = %v", m[0].IsMaskable, "0")
	}
}

func TestForm_NonadminCannotCancelOwnSubmittedRecord(t *testing.T) {
	// Setup conditions
	postData := url.Values{}
	postData.Set("CSRFToken", CsrfToken)
	postData.Set("numform_5ea07", "1")
	postData.Set("title", "TestForm_NonadminCannotCancelOwnSubmittedRecord")
	postData.Set("8", "1")
	postData.Set("9", "112")

	// TODO: streamline this
	res, _ := client.PostForm(RootURL+`api/form/new`, postData)
	bodyBytes, _ := io.ReadAll(res.Body)
	var response string
	json.Unmarshal(bodyBytes, &response)
	recordID, err := strconv.Atoi(string(response))

	if err != nil {
		t.Errorf("Could not create record for TestForm_NonadminCannotCancelOwnSubmittedRecord: " + err.Error())
	}

	postData = url.Values{}
	postData.Set("CSRFToken", CsrfToken)
	client.PostForm(RootURL+`api/form/`+strconv.Itoa(recordID)+`/submit`, postData)

	// Non-admin shouldn't be able to cancel a submitted record
	postData = url.Values{}
	postData.Set("CSRFToken", CsrfToken)

	res, _ = client.PostForm(RootURL+`api/form/`+strconv.Itoa(recordID)+`/cancel?masquerade=nonAdmin`, postData)
	bodyBytes, _ = io.ReadAll(res.Body)
	json.Unmarshal(bodyBytes, &response)
	got := response

	if got == "1" {
		t.Errorf("./api/form/[recordID]/cancel got = %v, want = %v", got, "An error message")
	}
}


func TestForm_Orgchart_Employee_Metadata(t *testing.T) {
	//setup.  normally set in employee selector result handler.
	mock_orgchart_employee := Orgchart_employee_metadata{
		FirstName: "Ramon",
		LastName: "Watsica",
		MiddleName: "Yundt",
		Email: "Ramon.Watsica@fake-email.com",
		UserName: "VTRYCXBETHANY",
	}
	org_emp_bytes, err := json.Marshal(mock_orgchart_employee)
	if err != nil {
		t.Error("Error Marshalling org emp struct")
	}

	//post and confirm post success
	postData := url.Values{}
	postData.Set("CSRFToken", CsrfToken)
	postData.Set("8", "201")
	postData.Set("8_metadata", "{\"orgchart_employee\":" + string(org_emp_bytes) + "}")

	res, err := client.PostForm(RootURL+`api/form/505`, postData)
	if err != nil {
		t.Error("Error sending post request")
	}

	bodyBytes, _ := io.ReadAll(res.Body)
	got := string(bodyBytes)
	want := `"1"`
	if !cmp.Equal(got, want) {
		t.Errorf("Admin did not have access got = %v, want = %v", got, want)
	}


	//get and confirm values struct values are the same
	resJSON, res := httpGet(RootURL + `api/form/505/metadata/8/1/_orgchart_employee`)
	if !cmp.Equal(res.StatusCode, 200) {
		t.Errorf("./api/form/505/data?masquerade=nonAdmin Status Code = %v, want = %v", res.StatusCode, 200)
	}
	resMetadata, _ := strconv.Unquote(resJSON)
	var org_emp_info Orgchart_employee_metadata
	err = json.Unmarshal([]byte(resMetadata), &org_emp_info)
	if err != nil {
		t.Error("Error on orgchart_employee_metadata unmarshal")
	}

	got = org_emp_info.FirstName
	want = mock_orgchart_employee.FirstName
	if !cmp.Equal(got, want) {
		t.Errorf("firstName got = %v, want = %v", got, want)
	}
	got = org_emp_info.LastName
	want = mock_orgchart_employee.LastName
	if !cmp.Equal(got, want) {
		t.Errorf("lastName got = %v, want = %v", got, want)
	}
	got = org_emp_info.MiddleName
	want = mock_orgchart_employee.MiddleName
	if !cmp.Equal(got, want) {
		t.Errorf("middleName got = %v, want = %v", got, want)
	}
	got = org_emp_info.Email
	want = mock_orgchart_employee.Email
	if !cmp.Equal(got, want) {
		t.Errorf("email got = %v, want = %v", got, want)
	}
	got = org_emp_info.UserName
	want = mock_orgchart_employee.UserName
	if !cmp.Equal(got, want) {
		t.Errorf("userName got = %v, want = %v", got, want)
	}
}
