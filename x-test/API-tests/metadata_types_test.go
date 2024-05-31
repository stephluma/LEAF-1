package main

import (
	"encoding/json"
	"io"
	"net/url"
	"testing"

	"github.com/google/go-cmp/cmp"

)

func TestMetadata_EmployeeMetadataSet(t *testing.T) {
	//setup normally be set in the employee selector result handler
	mock_org_emp := Orgchart_employee_md{
		Name:      "Watsica, Ramon Yundt",
		Email:     "Ramon.Watsica@fake-email.com",
		Title:     "Retail Assistant",
		UserID:    "VTRYCXBETHANY",
	}
	mock_md := Metadata{
		Orgchart_employee: mock_org_emp,
	}

	//post and confirm post success
	jsonBytesOrgEmp, err_oe := json.Marshal(mock_org_emp)
	jsonBytesMetadata, err_md := json.Marshal(mock_md)
	
	if err_md != nil || err_oe != nil {
        t.Error("encode metadata error:", err_md)
		t.Error("encode orgchat error:", err_oe)
    }
	postData := url.Values{}
	postData.Set("CSRFToken", CsrfToken)
	postData.Set("8", "201")
	postData.Set("8_metadata", string(jsonBytesMetadata))

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

	//get and confirm value
	resData, err := client.Get(RootURL + `api/form/505/rawIndicator/8/1`)
	if err != nil {
		t.Error("Error getting request data")
	}
	
	var v FormCategoryRawIndicatorResponse
	b, err := io.ReadAll(resData.Body)
	if err != nil {
		t.Error("Error reading res body")
	}

	err = json.Unmarshal(b, &v)
	if err != nil {
		t.Errorf("JSON parsing error, couldn't parse form response item: %v", string(b))
		t.Errorf("JSON parsing error: %v", err.Error())
	}

	resItemMetadataJSON := v["8"].Metadata
	metadata_bytes := []byte(resItemMetadataJSON)

	var m Metadata
	err = json.Unmarshal(metadata_bytes, &m)
	if err != nil {
		t.Errorf("JSON parsing error, couldn't parse response metadata: %v", string(metadata_bytes))
		t.Errorf("JSON parsing error: %v", err.Error())
	}

	jsonBytesOrgEmpRes, err := json.Marshal(m.Orgchart_employee)
	if err != nil {
		t.Error("encode error res orgchart employee:", err)
	}

	got = string(jsonBytesOrgEmpRes)
	want = string(jsonBytesOrgEmp)
	if !cmp.Equal(got, want) {
		t.Errorf("Expected employee metadata not found got = %v, want = %v", got, want)
	}
}
