/**
 * 
 */

// 도로명 주소 검색
function getPostcodeAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullAddr = ''; // 최종 주소 변수(도로명 주소)
            var fullAddrJibun = ''; // 최종 주소 변수(지번 주소)
            var extraAddr = ''; // 조합형 주소 변수
            
            ////////////////////////////////////////////////////////////////
            
            console.log("도로명 주소 : " + data.roadAddress);
            console.log("지번 주소 : " + data.jibunAddress);
            console.log("지번 주소(자동처리 : 지번 미출력시 자동 입력처리) : " + data.autoJibunAddress);

            // javateacher) 이 부분을 생략하여 도로명과 지번이 같이 넘어가도록 조치
            
            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            /*
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                
                fullAddr = data.roadAddress;

            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                // fullAddr = data.jibunAddress;
                fullAddrJibun = data.jibunAddress;
            }
            */

            fullAddr = data.roadAddress;
            // 지번 미입력시 : 자동 입력 지번 주소 활용(data.autoJibunAddress)
            fullAddrJibun = data.jibunAddress == '' ? data.autoJibunAddress : data.jibunAddress;


            // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
            // if(data.userSelectedType === 'R'){
                
            // 법정동명이 있을 경우 추가한다.
            if(data.bname !== ''){
                extraAddr += data.bname;
            }
            // 건물명이 있을 경우 추가한다.
            if(data.buildingName !== ''){
                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            
            // 조합형 주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
            // fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
            fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
                // fullAddrJibun += (extraAddr !== '' ? ' ('+ extraAddr +')' : ''); // javateacher 추가
            // }

            // javateacher end)
            
            ////////////////////////////////////////////////////////////////
                
            // 주소 정보 전체 필드 및 내용 확인 : javateacher
            var output = '';
            for (var key in data) {
                output += key + ":" +  data[key]+"\n";
            }
            
            console.log("-----------------------------")
            console.log(output);
            console.log("-----------------------------")

            // 3단계 : 해당 필드들에 정보 입력
            // 우편번호와 주소 정보를 해당 필드에 넣는다.

            // javateacher) 본 회원가입 코드에서는 도로명으로 선택하든 지번 주소로 선택하든
            // 일괄적으로 도로명으로 기본주소가 들어가도록 설정하였습니다.
            
            let zipFld = document.getElementById('zip');
            let roadAddressFld = document.getElementById('roadAddress');
            let jibunAddressFld = document.getElementById('jibunAddress');
			let detailAddressFld = document.getElementById('detailAddress');
            let addressFldErrPnl = document.getElementById('address_fld_err_pnl');

            zipFld.value = data.zonecode; // 5자리 우편번호 사용
            roadAddressFld.value = fullAddr; // 도로명 주소
			jibunAddressFld.value = fullAddrJibun; // 지번 주소
            
            // 커서를 상세주소 필드로 이동한다.
            detailAddressFld.focus();                        

            // 주소 필드 점검
            isCheckAddressFldValid(zipFld, roadAddressFld, jibunAddressFld, detailAddressFld, addressFldErrPnl);
        }   
    }).open();
}

/////////////////////////////////////////////////////////////////////////////////////////////

// 에러 메시징 함수
// 기능 : 필드별로 폼 점검 시행 후 에러 메시징(패널)
//        개별 필드 체크 플래그에 리턴
// 1) 함수명 : isCheckFldValid
// 2) 인자 :
// 필드 (아이디) 변수(fld), 필드 기정값(initVal),
// 필드별 정규표현식(유효성 점검 기준) (regex)
// 필드별 에러 패널(errPnl), 필드별 에러 메시지(errMsg)
// 3) 리턴 : fldCheckFlag : boolean (true/false) : 유효/무효
// 4) 용례(usage) :  
// idCheckFlag = isCheckFldValid(idFld, 
//                        /^[a-zA-Z]{1}\w{7,19}$/,
//                        idFldErrPnl,
//                        "",     
//                        "회원 아이디는 8~20사이의 영문으로 
//                        시작하여 영문 대소문자/숫자로 입력하십시오.")
function isCheckFldValid(fld, regex, initVal, errPnl, errMsg) {

    // 리턴값 : 에러 점검 플래그
    let fldCheckFlag = false;

    // 체크 대상 필드 값 확인
    console.log(`체크 대상 필드 값 : ${fld.value}`);

    // 폼 유효성 점검(test)
    console.log(`점검 여부 : ${regex.test(fld.value)}`);

    if (regex.test(fld.value) == false) {

        errPnl.style.height = "50px"; 
        errPnl.innerHTML = errMsg; 

        // 기존 필드 데이터 초기화
        // fld.value = "";
        fld.value = initVal;
        fld.focus(); // 재입력 준비     
        
        fldCheckFlag = false;

    } else { // 정상

        // 에러 패널 초기화
        errPnl.style.height = "0"; 
        errPnl.innerHTML = "";

        fldCheckFlag = true;
    } // if

    return fldCheckFlag;
} //

////////////////////////////////////////////////////

// 성별 필드 점검 이벤트 처리
// 에러 메시징 보완
// function isCheckGenderFldValid(genderFld) {
function isCheckGenderFldValid(genderFld, errPnl, errMsg) { 

    console.log("isCheckGenderFldValid");
    
    let resultFlag = false; 

    console.log(`남자 성별 체크 여부 : ${genderFld[0].checked}`);
    console.log(`여자 성별 체크 여부 : ${genderFld[1].checked}`);

    console.log(`genderFld[0].checked : ${genderFld[0].checked}`)
    console.log(`genderFld[1].checked : ${genderFld[1].checked}`)

    console.log("유효 조건 : " + (genderFld[0].checked ^ genderFld[1].checked));
    
    // if ((genderFld[0].checked == true && genderFld[1].checked == false) ||
    //    (genderFld[0].checked == false && genderFld[1].checked == true)) {
    if ((genderFld[0].checked ^ genderFld[1].checked) == 1) {

        // 에러 패널 초기화
        errPnl.style.height = "0"; 
        errPnl.innerHTML = "";

        resultFlag = true;
    }

    // 에러 메시징 누락 보완
    else {

        errPnl.style.height = "50px"; 
        errPnl.innerHTML = errMsg; 
        
        resultFlag = false;
    }


    return resultFlag;
} //

////////////////////////////////////////////////////

// 우편번호/주소 필드 점검
function isCheckAddressFldValid(zipFld, roadAddressFld, jibunAddressFld, detailAddressFld, addressFldErrPnl) {

    let resultFlag = false;

	let zipFldVal = zipFld.value;
	let roadAddressFldVal = roadAddressFld.value;
	let jibunAddressFldVal = jibunAddressFld.value;
	let detailAddressFldVal = detailAddressFld.value;
    

    // 점검 경우(주소 정보가 필수사항이 아닌 경우) : 점검 오류 발생 경우
    
    // 1) 우편번호/기본주소가 채워져 있는데 상세주소가 비워져 있는 경우
    //    - 에러 메시지 : 상세 주소를 입력하십시오.

    // 2) 우편번호/기본주소가 비워져 있는데 상세주소가 채워져 있는 경우
    //    - 에러 메시지 : 주소 검색을 통해서 우편번호와 기본주소를 입력하십시오.

	console.log("\n----------------------------------\n")
	
	console.log("우편번호 필드(길이) : " + zipFldVal.length);
	console.log("도로명 주소 필드(길이) : " + roadAddressFldVal.length);
	console.log("지번 주소 필드(길이) : " + jibunAddressFldVal.length);
	console.log("상세 주소 필드(길이) : " + detailAddressFldVal.length);
	
	// 주소 필드들의 길이로 점검
	
    // 1) 상세주소 미입력시
    if (zipFldVal.length != 0 && roadAddressFldVal.length != 0 && 
		jibunAddressFldVal.length != 0 && detailAddressFldVal.length == 0) {  
			
		console.log("주소 필드 에러 메시지 : 상세주소를 넣지 않았습니다.")	
    
        resultFlag = false;
        addressFldErrPnl.innerHTML = "상세 주소를 입력하십시오.";

    // 2) 기본주소 미입력시(주소 미검색)
	} else if (zipFldVal.length == 0 && roadAddressFldVal.length == 0 && 
			   jibunAddressFldVal.length == 0 && detailAddressFldVal.length != 0) {
				
		console.log("주소 필드 에러 메시지 : 주소 검색을 통해서 우편번호와 기본주소를 입력하십시오.")
		
        resultFlag = false;
        addressFldErrPnl.innerHTML = "주소 검색을 통해서 우편번호와 기본주소를 입력하십시오.";

	// 3) 모든 조건 충족
    } else {              
        
		console.log("주소 필드 에러 메시지 : 모든 조건 만족")
        // 
        resultFlag = true;                
        addressFldErrPnl.innerHTML = ""; // 필드 에러 메시지 초기화
    }
    
    return resultFlag;
} //    

////////////////////////////////////////////////////

window.onload = () => {

    // 각 필드들의 에러 점검 여부 (플래그(flag) 변수)
    let idCheckFlag = false;

	// 아이디 중복 점검 플래그
	let idDuplicatedCheckFlag = false;  

    // 패쓰워드 점검 플래그 
    let pwCheckFlag = false;

    // 이름 점검 플래그
    let nameCheckFlag = false;

    // 성별 점검 플래그
    let genderCheckFlag = false;

    // 이메일 점검 플래그
    let emailCheckFlag = false;

	// 이메일 중복 점검 플래그
	let emailDuplicatedCheckFlag = false;

    // 연락처 점검 플래그
    let mobileCheckFlag = false;

	// 연락처(휴대폰) 중복 점검 플래그
	let mobileDuplicatedCheckFlag = false;
	
	// 연락처(집전화) 점검 플래그
	let phoneCheckFlag = false;
	
    // 주소 점검 플래그
    // 주소에 대한 사항이 필수가 아니라 선택 사항인 경우는 
    // 입력하지 않아도 무관하기 때문에 초기 상태(무입력 상태)도 true로 간주하여
    // 초기값 true 설정
    let addressCheckFlag = true;

    // 생일 점검 플래그
    let birthdayCheckFlag = false;

    // 아이디 필드 폼 점검(form validation)
    // 아이디 필드 인식
    let idFld = document.getElementById("id");

    // 아이디 에러 패널 인식
    let idFldErrPnl = document.getElementById("id_fld_err_pnl");

    // 패쓰워드 필드 인식
    let pwFld = document.getElementById("password");

    // 패쓰워드 에러 패널 인식
    let pwFldErrPnl = document.getElementById("password_fld_err_pnl");

    // 이름 필드 인식
    let nameFld = document.getElementById("name");

    // 이름 에러 패널 인식
    let nameFldErrPnl = document.getElementById("name_fld_err_pnl");

    // 성별 필드 인식
    let genderFld = document.querySelectorAll("[name='gender']");

    // 성별 필드 에러 패널 인식
    let genderFldErrPnl = document.getElementById("gender_fld_err_pnl");

    // 이메일 필드 인식
    let emailFld = document.getElementById("email");

    // 이메일 필드 에러 패널 인식
    let emailFldErrPnl = document.getElementById("email_fld_err_pnl");

    // 연락처(휴대폰) 필드 인식
    let mobileFld = document.getElementById("mobile");

    // 연락처(휴대폰) 필드 에러 패널 인식
    let mobileFldErrPnl = document.getElementById("mobile_fld_err_pnl");

	// 연락처(집전화) 필드 인식
    let phoneFld = document.getElementById("phone");

	// 연락처(집전화) 필드 에러 패널 인식
    let phoneFldErrPnl = document.getElementById("phone_fld_err_pnl");

    // 우편번호/주소 필드 인식
    let zipFld = document.getElementById("zip");

    let roadAddressFld = document.getElementById("roadAddress");

    let jibunAddressFld = document.getElementById("jibunAddress");

	let detailAddressFld = document.getElementById("detailAddress");

    // 주소 필드 에러 패널 인식
    let addressFldErrPnl = document.getElementById("address_fld_err_pnl");

    // 생일 필드 인식
    let birthdayFld = document.getElementById("birthday");

    // 생일 필드 에러 패널 인식
    let birthdayFldErrPnl = document.getElementById("birthday_fld_err_pnl");

    ////////////////////////////////////////////////////////////////////////

    // 아이디 필드 입력 후 이벤트 처리
    idFld.onblur = (e) => {

        // console.log("id fld blur");
        // 아이디 필드 값 확인
        console.log(`아이디 필드 값 : ${idFld.value}`);

        // 아이디 필드 유효성 점검(validation)
        // 기준)
        /*
            1) 길이(length) : 8~20자
            2) 첫자 제한: alphabet(영문)으로 시작
            3) 한글 입력 제한 : 불가.
            4) 제약조건 : 영문자 및 숫자만을 허용
            5) regex(정규표현식) : /^[a-zA-Z]{1}\w{7,19}$/
            참고) https://www.regexpal.com/
            6) 메시징 : 회원 아이디는 8~20사이의 영문으로 시작하여 
                       영문 대소문자/숫자로 입력하십시오.
        */   
        // 아이디 정규표현식(regex)
        const regexId = /^[a-zA-Z]{1}\w{7,19}$/;

        // 폼 유효성 점검(test)
        console.log(`점검 여부 : ${regexId.test(idFld.value)}`);

        if (regexId.test(idFld.value) == false) {

            let idErrMsg = "회원 아이디는 8~20사이의 영문으로 시작하여 영문 대소문자/숫자로 입력하십시오.";

            // 에러 패널 메시지 표시 : alert => 에러 패널
            // : 패널 높이(50px), 메시지(red)
            idFldErrPnl.style.height = "50px"; 
	
            // 기존 필드 데이터 초기화
            idFld.value = "";
            idFld.focus(); // 재입력 준비     
            
            // 에러 점검 플래그
            idCheckFlag = false;

        } else { // 정상

            // 에러 패널 초기화
            idFldErrPnl.style.height = "0"; 
            idFldErrPnl.innerHTML = "";

            // 에러 점검 플래그
            idCheckFlag = true;

        } // if

    } // idFld.onblur ...

    // 아이디 점검 키보드 입력시 실시간 점검
    idFld.onkeyup = () => {

        console.log("아이디 온키업");
        idCheckFlag = isCheckFldValid(idFld, 
                        /^[a-zA-Z]{1}\w{7,19}$/,
                        idFld.value,
                        idFldErrPnl,
                        "회원 아이디는 8~20사이의 영문으로 시작하여 영문 대소문자/숫자로 입력하십시오.");
    } // idFld.onkeyup ... 

    //////////////////////////////////////           

    // 패쓰워드 필드 입력 후 이벤트 처리 : blur
    pwFld.onblur = (e) => {

        // console.log("패쓰워드 필드 blur")
        // 패쓰워드 필드 유효성 점검(validation)
        // 기준)
        /*
            1) 길이(length) 8~20 : {8,20}
            2) 최소 1개의 숫자 포함 : (?=.*\d)
            3) 최소 1개의 특수문자 포함 : (?=.*\W)
            4) 대문자 1개 이상 포함 : (?=.*[A-Z])
            5) 소문자 1개 이상 포함 : (?=.*[a-z])
            6) regex(정규표현식) : (?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}
            7) 메시징 : 회원 패쓰워드는 영문 대소/숫자/특수문자 1개이상 포함하여 8~20자로 작성하십시오..
        */
        pwCheckFlag = isCheckFldValid(pwFld,                                 
                        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}/,
                        "",
                        pwFldErrPnl,
                        "회원 패쓰워드는 영문 대소/숫자/특수문자 "+ 
                        "1개이상 포함하여 8~20자로 작성하십시오.");
    } //     

    // 패쓰워드 필드 입력 후 이벤트 처리 : keyup
    pwFld.onkeyup = (e) => {

        console.log("패쓰워드 필드 keyup")
        pwCheckFlag = isCheckFldValid(pwFld,                                 
                        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}/,
                        pwFld.value,
                        pwFldErrPnl,
                        "회원 패쓰워드는 영문 대소/숫자/특수문자 1개이상 포함하여 8~20자로 작성하십시오.");
    } //     

    /////////////////////////////////////

    // 이름 필드 입력 후 이벤트 처리 : blur
    nameFld.onblur = (e) => {

        console.log("이름 필드 blur")
        // 이름 필드 유효성 점검(validation)
        // 기준)
        /*
            1) 한글"만" : 3~50자 (성함 사이 띄워쓰기 포함)
            2) 성/함(이름) : 1자만 띄워쓰기 ex) 홍 길동, 남궁 민수
            3) regex(정규표현식) : /^[가-힣]{1,2}[\s]{1}[가-힣]{1,47}$/
            4) 메시징 : 회원 이름은 한글 이름만 허용됩니다. 제시된 예와 같이 작성해주세요.
        */
        nameCheckFlag = isCheckFldValid(nameFld,                                 
                        /^[가-힣]{1,2}[\s]{1}[가-힣]{1,47}$/,
                        "",
                        nameFldErrPnl,
                        "회원 이름은 한글 이름만 허용됩니다. 제시된 예와 같이 작성해주세요.");
    } //     

    // 이름 필드 입력 후 이벤트 처리 : keyup
    nameFld.onkeyup = (e) => {

        console.log("이름 필드 blur")
        nameCheckFlag = isCheckFldValid(nameFld,                                 
                        /^[가-힣]{1,2}[\s]{1}[가-힣]{1,47}$/,
                        nameFld.value,
                        nameFldErrPnl,
                        "회원 이름은 한글 이름만 허용됩니다. 제시된 예와 같이 작성해주세요.");
    } //    

    
    ///////////////////////////////////////////////////////////////////////

    // 이메일 필드 입력 후 이벤트 처리 : onkeyup
    emailFld.onkeyup = (e) => {

        console.log("이메일 필드 onkeyup")
        // 이메일 필드 유효성 점검(validation)
        // 기준)
        /*
            1) "@", "." 포함여부 점검
            2) regex(정규표현식) : /^[a-zA-Z0-9_+.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/
            3) 메시징 : 회원 이메일을 제시된 예와 같이 작성해주세요.
        */
        emailCheckFlag = isCheckFldValid(emailFld,
                        /^[a-zA-Z0-9_+.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/,
                        emailFld.value,
                        emailFldErrPnl,
                        "회원 이메일을 제시된 예와 같이 작성해주세요.");
    } //     

    // 연락처(휴대폰) 필드 입력 후 이벤트 처리 : onkeyup
    mobileFld.onkeydown = (e) => {

        console.log("연락처(휴대폰) 필드 onkeyup")
        // 연락처 필드 유효성 점검(validation)
        // 기준)
        /*
            1) 휴대폰 입력 예시 : ex) 010-1234-5678
            2) regex(정규표현식) : /^010-\d{4}-\d{4}$/
            3) 메시징 : 회원 연락처(휴대폰)를 제시된 예와 같이 작성해주세요.
        */
        mobileCheckFlag = isCheckFldValid(mobileFld,
                        /^010-\d{4}-\d{4}$/,
                        mobileFld.value,
                        mobileFldErrPnl,
                        "회원 연락처(휴대폰)를 제시된 예와 같이 작성해주세요.");
    } //     


    // 연락처(집전화) 필드 입력 후 이벤트 처리 : onkeyup
    phoneFld.onkeyup = (e) => {

        console.log("연락처(집전화) 필드 onkeyup")
        // 연락처 필드 유효성 점검(validation)
        // 기준)
        /*
            1) 휴대폰 입력 예시 : ex) 02-111-5678
            2) regex(정규표현식) : /^0\d{1,2}-\d{3,4}-\d{4}$/
            3) 메시징 : 회원 연락처(휴대폰)를 제시된 예와 같이 작성해주세요.
        */
        phoneCheckFlag = isCheckFldValid(phoneFld,
                        /^0\d{1,2}-\d{3,4}-\d{4}$/,
                        phoneFld.value,
                        phoneFldErrPnl,
                        "회원 연락처(집전화)를 제시된 예와 같이 작성해주세요.");
    } //     

    ///////////////////////////////////////////////////////////////////////

    // 주소 필드 입력 후 이벤트 처리 : 상세주소 필드 => onblur
    // 점검 사항 :
    // 1) 주소 필드의 경우 필수 사항인 경우는 우편번호/기본주소/상세주소가 다 들어가는지 점검해야 합니다.
    // 2) 필수 사항이 아닐 경우는 다 비워져 있는 경우는 문제가 안되며, 그렇지 않고 필드 한개가 누락된 경우는
    //    폼 점검 에러를 유발하도록 구성합니다.

    detailAddressFld.onblur = (e) => {

        // 점검 경우(주소 정보가 필수사항이 아닌 경우) : 점검 오류 발생 경우
        
        // 1) 우편번호/기본주소가 채워져 있는데 상세주소가 비워져 있는 경우
        //    - 에러 메시지 : 상세 주소를 입력하십시오.

        // 2) 우편번호/기본주소가 비워져 있는데 상세주소가 채워져 있는 경우
        //    - 에러 메시지 : 주소 검색을 통해서 우편번호와 기본주소를 입력하십시오.

        console.log("주소 필드에러 메시지 : " + addressFldErrPnl.innerHTML);

        addressCheckFlag = isCheckAddressFldValid(zipFld, roadAddressFld, jibunAddressFld, detailAddressFld, addressFldErrPnl);

    } //

    detailAddressFld.onkeyup = (e) => {

        // 점검 경우(주소 정보가 필수사항이 아닌 경우) : 점검 오류 발생 경우

        // 1) 우편번호/기본주소가 채워져 있는데 상세주소가 비워져 있는 경우
        //    - 에러 메시지 : 상세 주소를 입력하십시오.

        // 2) 우편번호/기본주소가 비워져 있는데 상세주소가 채워져 있는 경우
        //    - 에러 메시지 : 주소 검색을 통해서 우편번호와 기본주소를 입력하십시오.

        console.log("주소 필드에러 메시지 : " + addressFldErrPnl.innerHTML);

        addressCheckFlag = isCheckAddressFldValid(zipFld, roadAddressFld, jibunAddressFld, detailAddressFld, addressFldErrPnl);
       
    } //

    ///////////////////////////////////////////////////////////////////////

     // (검색된) 주소 삭제
    let addressDeleteBtn = document.getElementById("address_delete_btn");

    addressDeleteBtn.onclick = function(e) {

        console.log("주소 삭제");

        zip.value = "";
        roadAddressFld.value = "";
        jibunAddressFld.value = "";

		// 주소 에러 메시지 제거
		addressFldErrPnl.innerHTML = ""; // 에러 메시지 삭제
    } //

    /////////////////////////////////////////////////////////////////

    // 생일 필드 입력 후 이벤트 처리 : onkeyup
    birthdayFld.onkeyup = (e) => {

        console.log("생일 필드 onkeyup")

        // 생일 필드 유효성 점검(validation)
        // 기준)
        /*
            1) 생일 입력 예시 : ex) 2000-01-01
            2) regex(정규표현식) : /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/
            3) 메시징 : 회원 생일을 제시된 예와 같이 작성해주세요.
        */
       birthdayCheckFlag = isCheckFldValid(birthdayFld,
                        /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/,
                        birthdayFld.value,
                        birthdayFldErrPnl,
                        "회원 생일을 제시된 예와 같이 작성해주세요.");
    } //     

    /////////////////////////////////////////////////////////////////

    // 성별 필드 점검 이벤트 처리 : onblur
    // 남자 필드(radio1)
    genderFld[0].onblur = (e) => {

        genderCheckFlag = isCheckGenderFldValid(genderFld, 
                                                genderFldErrPnl,
                                                "성별 정보를 입력하세요.");
    } //       
    
    // 여자 필드(radio2)
    genderFld[1].onblur = (e) => {

        genderCheckFlag = isCheckGenderFldValid(genderFld, 
                                                genderFldErrPnl,
                                                "성별 정보를 입력하세요.");
    } //            


    /////////////////////////////////////////////////////////////////

	// 아이디/이메일/연락처(휴대폰) 중복 점검
	// 아이디 중복 점검 : AJAX axios
	idFld.onblur = (e) => {
		
		console.log(`아이디 중복 점검 : ${idFld.value}`);
		
		idCheckFlag = isCheckFldValid(idFld, 
                        /^[a-zA-Z]{1}\w{7,19}$/,
                        idFld.value,
                        idFldErrPnl,
                        "회원 아이디는 8~20사이의 영문으로 시작하여 영문 대소문자/숫자로 입력하십시오.");

		if (idCheckFlag == true) {
		 
			axios.get(`/memberProject/member/hasFld/id/${idFld.value}`)
				 .then(function(response) {
					
					// console.log("서버 응답 : " + JSON.stringify(response));
					
					idDuplicatedCheckFlag = response.data;
					
					console.log("response.data : ", response.data);
					// console.log("response.data : ", typeof(response.data));
	
					let idDupErrMsg = idDuplicatedCheckFlag == true ? "중복되는 아이디가 존재합니다" : "사용가능한 아이디입니다"				   
					console.log(idDupErrMsg);
					
					// 메시지 반복 출력 방지 : 출력할 메시지 있으면 출력
					if (idDuplicatedCheckFlag == true) {
					
						alert(idDupErrMsg);
						idFld.value = "";
					}					
						
				 })
				 .catch(function(err) {
					console.error("아이디 중복 점검 중 서버 에러가 발견되었습니다.");
					//idDuplicatedCheckFlag = false;
				 });
			
		} // if	
			
	} //
	
	// 이메일 중복 점검 : AJAX axios
	emailFld.onblur = (e) => {
		
		console.log("이메일 중복 점검");
		
		emailCheckFlag = isCheckFldValid(emailFld,
                        /^[a-zA-Z0-9_+.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/,
                        emailFld.value,
                        emailFldErrPnl,
                        "회원 이메일을 제시된 예와 같이 작성해주세요.");
		 
		if (emailCheckFlag == true) {
			
			axios.get(`/memberProject/member/hasFld/email/${emailFld.value}`)
				 .then(function(response) {
					
					emailDuplicatedCheckFlag = response.data;
					console.log("response.data : ", response.data);
	
					let emailDupErrMsg = emailDuplicatedCheckFlag == true ? "중복되는 이메일이 존재합니다" : "사용가능한 이메일입니다"				   
					console.log(emailDupErrMsg)
					
					// 메시지 반복 출력 방지 : 출력할 메시지 있으면 출력
					if (emailDuplicatedCheckFlag == true) {
					
						alert(emailDupErrMsg);
						emailFld.value = "";
					}
					
				 })
				 .catch(function(err) {
					console.error("이메일 중복 점검 중 서버 에러가 발견되었습니다.");
					//emailDuplicatedCheckFlag = false;
				 });
		} // if
			
	} //
	
	// 연락처(휴대폰) 중복 점검 : AJAX axios
	mobileFld.onblur = (e) => {
		
		console.log("연락처(휴대폰) 중복 점검");
		
		mobileCheckFlag = isCheckFldValid(mobileFld,
                        /^010-\d{4}-\d{4}$/,
                        mobileFld.value,
                        mobileFldErrPnl,
                        "회원 연락처(휴대폰)를 제시된 예와 같이 작성해주세요.")
		
		if (mobileCheckFlag == true) {
			 
			axios.get(`/memberProject/member/hasFld/mobile/${mobileFld.value}`)
				 .then(function(response) {
					
					mobileDuplicatedCheckFlag = response.data;
					console.log("response.data : ", response.data);
	
					let mobileDupErrMsg = mobileDuplicatedCheckFlag == true ? "중복되는 연락처(휴대폰)가 존재합니다" : "사용가능한 연락처(휴대폰)입니다"			   
					console.log(mobileDupErrMsg);
					
					// 메시지 반복 출력 방지 : 출력할 메시지 있으면 출력
					if (mobileDuplicatedCheckFlag == true) {

						alert(mobileDupErrMsg);
						mobileFld.value = "";
					}	
						
				 })
				 .catch(function(err) {
					console.error("연락처(휴대폰) 중복 점검 중 서버 에러가 발견되었습니다.");
					//mobileDuplicatedCheckFlag = false;				
				 });
		
		} // if
				
	} //


    /////////////////////////////////////////////////////////////////
 
    // 전송 버튼 이벤트 처리
    let frm = document.getElementById("frm");

    frm.onsubmit = function(e) {
	
		alert("회원가입 폼점검");	
	
        console.log("\n######## 회원가입폼 전체점검 ###############################\n");

        console.log(`아이디 점검 플래그(idCheckFlag) : ${idCheckFlag}`);
        console.log(`패쓰워드 점검 플래그(pwCheckFlag) : ${pwCheckFlag}`);
        console.log(`이름 점검 플래그(nameCheckFlag) : ${nameCheckFlag}`);

        // 성별 점검 플래그 점검
        // 에러 메시징 보완
        // genderCheckFlag = isCheckGenderFldValid(genderFld);
        genderCheckFlag = isCheckGenderFldValid(genderFld, 
                                                genderFldErrPnl,
                                                "성별 정보를 입력하세요.");

        console.log(`성별 점검 플래그(genderCheckFlag) : ${genderCheckFlag}`);            

        // 이메일 및 연락처 점검 플래그
        console.log(`이메일 점검 플래그(emailCheckFlag) : ${emailCheckFlag}`);
        console.log(`연락처(휴대폰) 점검 플래그(mobileCheckFlag) : ${mobileCheckFlag}`);
		console.log(`연락처(집전화) 점검 플래그(phoneCheckFlag) : ${phoneCheckFlag}`);
		
        // 주소 필드 점검 플래그
        addressCheckFlag = isCheckAddressFldValid(zipFld, roadAddressFld, jibunAddressFld, detailAddressFld, addressFldErrPnl); 

        console.log(`주소 점검 플래그(addressCheckFlag) : ${addressCheckFlag}`);

		console.log("주소 플래그 동등 여부 " + (addressCheckFlag == false));

        // 생일 필드 점검 플래그
        console.log(`생일 점검 플래그(birthdayCheckFlag) : ${birthdayCheckFlag}`);

		// 아이디/이메일/연락처(휴대폰) 중복 점검 플래그
		// 주의) 이 플래그들은 false 이어야 중복되지 않는 값을 의미합니다.  
		console.log(`아이디 중복 점검 플래그(idDuplicatedCheckFlag) : ${idDuplicatedCheckFlag}`);
		console.log(`이메일 중복 점검 플래그(emailDuplicatedCheckFlag) : ${emailDuplicatedCheckFlag}`);
		console.log(`연락처(휴대폰) 중복 점검 플래그(mobileDuplicatedCheckFlag) : ${mobileDuplicatedCheckFlag}`);
		
		console.log("\n######################################################\n\n");
		
		alert("잠시 전체 폼점검 플래그 확인");
				
        // 모든 플래그 참(true) : 논리곱(&&)
		// 집전화 필드
		// 아이디/이메일/연락처(휴대폰) 중복 점검 필드 추가
		// 주의) 아이디/이메일/연락처(휴대폰) 중복 점검 필드는 false(중복 안됨)이어야 정상값입니다.
        if (idCheckFlag == true &&
            pwCheckFlag == true &&
            nameCheckFlag == true &&
            genderCheckFlag == true &&
            emailCheckFlag == true &&
            mobileCheckFlag == true &&
            phoneCheckFlag == true &&
            addressCheckFlag == true &&
            birthdayCheckFlag == true &&
			idDuplicatedCheckFlag == false &&
			emailDuplicatedCheckFlag == false &&
			mobileDuplicatedCheckFlag == false)
        {
            alert("회원가입 정보 전송");

        } else {
	
            // TODO
			alert("폼 점검 오류");
            console.log("폼 점검 오류");
	
            // 필드들을 종합적으로 일일이 점검할 필요가 있기 때문에 
            // if ~ else if문은 사용하지 않고 개별 if문을 사용하도록 하겠습니다.

            // 아이디 필드 재점검                    
            if (idCheckFlag == false) {

                idCheckFlag = isCheckFldValid(idFld, 
                            /^[a-zA-Z]{1}\w{7,19}$/,
                            idFld.value,
                            idFldErrPnl,
                            "회원 아이디는 8~20사이의 영문으로 시작하여 영문 대소문자/숫자로 입력하십시오.");
            } //

            // 패쓰워드 필드 재점검
            if (idCheckFlag == false) {

                pwCheckFlag = isCheckFldValid(pwFld,                                 
                            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}/,
                            "",
                            pwFldErrPnl,
                            "회원 패쓰워드는 영문 대소/숫자/특수문자 "+ 
                            "1개이상 포함하여 8~20자로 작성하십시오.");
            } //    

            // 이름 필드 재점검
            if (nameCheckFlag == false) {

                nameCheckFlag = isCheckFldValid(nameFld,                                 
                                /^[가-힣]{1,2}[\s]{1}[가-힣]{1,47}$/,
                                nameFld.value,
                                nameFldErrPnl,
                                "회원 이름은 한글 이름만 허용됩니다. 제시된 예와 같이 작성해주세요.");

            } //
            
            // 성별 필드 재점검
            if (genderCheckFlag == false) {

                genderCheckFlag = isCheckGenderFldValid(genderFld, 
                                                    genderFldErrPnl,
                                                    "성별 정보를 입력하세요.");
            } //    

            // 이메일 필드 재검검
            if (emailCheckFlag == false) {
                
                emailCheckFlag = isCheckFldValid(emailFld,
                                /^[a-zA-Z0-9_+.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/,
                                emailFld.value,
                                emailFldErrPnl,
                                "회원 이메일을 제시된 예와 같이 작성해주세요.");

            } //    

            // 연락처 필드 재점검
            if (mobileCheckFlag == false) {

                mobileCheckFlag = isCheckFldValid(mobileFld,
                        /^010-\d{4}-\d{4}$/,
                        mobileFld.value,
                        mobileFldErrPnl,
                        "회원 연락처(휴대폰)를 제시된 예와 같이 작성해주세요.");
            } // 

 			// 연락처(집전화) 필드 재점검
            if (phoneCheckFlag == false) {

                phoneCheckFlag = isCheckFldValid(phoneFld,
                        /^0\d{1,2}-\d{3,4}-\d{4}$/,
                        phoneFld.value,
                        phoneFldErrPnl,
                        "회원 연락처(집전화)를 제시된 예와 같이 작성해주세요.");
            } // 

            // 우편번호/주소 필드 재점검
            if (addressCheckFlag == false) {
                
                addressCheckFlag = isCheckAddressFldValid(zipFld, roadAddressFld, jibunAddressFld, detailAddressFld, addressFldErrPnl); 
            } //

            // 생일 필드 재점검
            if (birthdayCheckFlag == false) {

                birthdayCheckFlag = isCheckFldValid(birthdayFld,
                                    /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/,
                                    birthdayFld.value,
                                    birthdayFldErrPnl,
                                    "회원 생일을 제시된 예와 같이 작성해주세요.");
            } //

			// 아이디/이메일/연락처(휴대폰) 중복 재점검에 따른 최종 메시징			
			if (idDuplicatedCheckFlag == true) {
				alert("중복되는 아이디가 존재합니다");
			}
			
			if (emailDuplicatedCheckFlag == true) {
				alert("중복되는 이메일이 존재합니다");
			}
			
			if (mobileDuplicatedCheckFlag == true) {
				alert("중복되는 연락처(휴대폰)가 존재합니다");
			}
			
		    // 전송 방지
		    e.preventDefault();			
        } //

    } // frm.onsubmit ...

} // window.onload ...