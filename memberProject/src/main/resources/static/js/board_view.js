/**
 * 
 */

// 댓글 목록 읽어오기
function getAllReplies(originalBoardId, boardWriter) {
	
	axios.get(`/memberProject/board/getRepliesAll.do?boardNum=${originalBoardId}`) 
		 .then(function(response) {
			 
			// alert("전체 댓글 가져오기");
			
			let resData = response.data;
			console.log("response.data : ", resData);

			// 전체 댓글 현황 리턴 확인
			console.log("전체 댓글 수 : ", resData.length);
			
			let replyListPnl = document.getElementById("reply_list_pnl");
			let replyData = "";
			
			for (let reply of resData) {

				// 날짜 포매팅(형식화)
				let replyFormattedBoardDate = reply.boardDate;
				
				/* ------------------------------------------------------------------------------------------------------ */
				
				// 개별 게시글 동적 패널
				replyData = `<div id="reply_${reply.boardNum}" class="border-bottom border-dark-1 bg-light w-100 ps-4">
								
								<div class="d-flex flex-row py-2">
								
									<!-- 사람 아이콘 -->
									<div class="me-2">
									
										<i class="bi bi-person-circle" style="font-size:3em; color:#ccc"></i>
										
									</div>
									<!--// 사람 아이콘 -->
									
									<!-- 작성자 : bootstrap badge(뱃지) 적용 -->
									<!-- 참고 : https://getbootstrap.com/docs/5.3/components/badge/#positioned -->
									
									<!-- 실제 댓글 작성자 파악을 위해 id 등록 -->
									<div id="reply_actual_writer_${reply.boardNum}" class="d-flex align-items-center ms-1 mt-1">
									
										<!-- 실제 댓글 작성자 파악을 위해 id 등록 -->	
										<button id="reply_writer_${reply.boardWriter}" type="button" class="btn btn-info position-relative">
											
											${reply.boardWriter}
							
										  	<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
										    	작성자
										    	<span class="visually-hidden">unread messages</span>
										  	</span>
										  	
										</button>
																				
									</div>
									<!--// 작성자 -->
									
								</div>
							
								<!-- 댓글 내용 -->	
								<div class="my-1 d-flex flow">
								
									<!-- 댓글 제어의 원활하게 하기 위해 div에 ID 할당 -->
									<div id="boardContent_${reply.boardNum}">
										${reply.boardContent}
									</div>
									
								</div>
								<!--// 댓글 내용 -->
								
								<!-- ///////////////////////////////////////////////////////////////// -->
								
								<!-- 댓글 작성일,  댓글 수정/삭제 메뉴 : 2024.3(이관) -->
								<div class="my-1 d-flex flow row">
								
									<div class="col-4 pt-1">
										${replyFormattedBoardDate}
									</div>
									
									<!-- 메뉴 추가(이동) : 댓글 수정/삭제 : 2024.3 -->
									<div class="col-8 d-flex justify-content-end">
									
										<a href="#" id="reply_update_btn_${reply.boardNum}" class="btn btn-sm btn-outline-primary me-2 mb-1" 
										   onClick="updateReply(${originalBoardId}, ${reply.boardNum}, '${boardWriter}')">수정</a>
							
										<a href="#" id="reply_delete_btn_${reply.boardNum}" class="btn btn-sm btn-outline-primary mb-1 me-3"
										   onClick="deleteReply(${originalBoardId}, ${reply.boardNum}, '${boardWriter}')">삭제</a>
						
									</div>
									<!--// 메뉴 추가(이동) : 댓글 수정/삭제 : 2024.3 -->
									
								</div>
								<!--// 댓글 작성일 -->
								
								<!-- ///////////////////////////////////////////////////////////////// -->
								
							</div>`;
							
				/* ------------------------------------------------------------------------------------------------------ */
				
				replyListPnl.innerHTML += replyData;	
				
			} // for
			
		 })	 				 
		 .catch(function(err) {
			console.error("댓글 작성 중 서버 에러가 발견되었습니다.");
		 }); // axios			  
	
	// 개별글 로딩시 지금까지 집계된 댓글들 읽어오기 '끝"
	
} //

/* **************************************************************************************************** */

// 댓글 작성 : 인자 변경
function writeReply(originalBoardId, boardWriter) {
	
	console.log("originalBoardId : ", originalBoardId);
	
	// 개별 게시글 읽어올 때 바로 개별 게시글의 댓글들 읽어옴(로딩)
	let replyWriteBtn = document.getElementById("reply_write_btn_" + originalBoardId);
	
	console.log("replyWriteBtn : ", replyWriteBtn);
	
 	// for (replyWriteBtn of replyWriteBtns) {
 	
    // 참고) 간혹 아래와 같이 기존에 함수로 분리되기 전에는 없던 에러가 발생할 수 있습니다.(그러나 동작상에는 문제는 없음 !) 
    // 바로 진입할 경우는 아래와 같은 에러 console 창에서 출력될 수 있습니다. 
    // 
    // 예상 오류) Uncaught TypeError: Cannot set properties of null (setting 'onclick')
	
    // 그럼에도 불구하고 댓글 전송 등 작동에는 문제가 없습니다만,
    // 괜히 성가신 오류 메시지를 제거하기 위해서는
    // replyWriteBtn.addEventListener('click', function(e) {
	// 와 같이 사용할 것을 권장드립니다.
   
	// 댓글 작성 
	// replyWriteBtn.onclick = (e) =>  {
	replyWriteBtn.addEventListener('click', function(e) { // 함수 내부에는 이와 같은 표현 권장	
		
		//로그인 미인증 시 알림창 띄우고 페이지 이동 없음
		if (boardWriter == 'anonymousUser'){
		
			alert("댓글 작성을 위해서 로그인이 필요합니다.");
			//location.href = "/memberProject/login";
			//location.href = "/memberProject/board/replyWrite.do";
			//movePath ="redirect:/memberProject/board/replyWrite.do";
			//history.back();//이전 페이지로 돌아가기
			//location.reload();
			
		} else {
			
			let originalBoardId = e.target.id;
			originalBoardId = originalBoardId.substring('reply_write_btn_'.length);
			
			console.log("댓글의 원글 아이디 : ", originalBoardId);
			
			let replyWriteForm = document.getElementById("reply_write_form");
			
			// 주의) 이 부분에서 매우 주의해야 되는 이유는  JS 파일을 분리하면서 '[[${#authentication.name}]]' thymeleaf 요소가
			// 인식되지 않을 수 있습니다. 이럴 경우는 함수의 인자로 처리하여 코드 결손 현상을  패치해야 됩니다.
			// 참고로 과거 JSP에서도 이러한 현상이 종종 있어서 같은 방식으로 인자 결손 현상을 패치하였습니다.
			
			// alert('[[${#authentication.name}]]');
			// 참고) 위와 같이 조치해보면 로그인된 아이디가 분리된 JS 파일에서는 인식되지 않는 것을 확인할 수 있습니다. 
			
			// 현재 로그인 한 회원
			// let boardWriter = '[[${#authentication.name}]]';
			 			
			console.log("댓글 작성자 : ", boardWriter);
			
			// 댓글 폼점검
			// 댓글 한계량을 100자 이내로 한정합니다.
			console.log("댓글 길이 : ", replyWriteForm.value.length);
			
			// 패쓰워드 폼점검
			let boardPass = document.getElementById('board_pass_'+originalBoardId);
			
			if (boardPass.value.trim() == '') {
				
				alert("댓글 패쓰워드를 입력하십시오");
				boardPass.focus();
				
			}  else {
			
	 			if (replyWriteForm.value.length > 100) {
	 				
	 				alert("댓글은 100자 이내로 작성하셔야 합니다.");
	 				
	 				// 댓글을 100자로 잘라서 다시 댓글값에 표시
	 				replyWriteForm.value = replyWriteForm.value.substring(0, 100);
	 				replyWriteForm.focus(); // 재입력 대기 				
	 			
	 			} else { 
				 
	 				// 전송			  
	 				axios.post('/memberProject/board/replyWrite.do', 
	 					{
							boardNum : originalBoardId,
							boardContent : replyWriteForm.value,
							boardWriter : boardWriter,
							boardPass : boardPass.value,
	 					}
	 				)
	 				 .then(function(response) {
	 					
	 					let resData = response.data;
	 					console.log("response.data : ", resData);
	
	 					// 전체 댓글 현황 리턴 확인
	 					console.log("전체 댓글 수 : ", resData.length);
	 					
	 					let replyListPnl = document.getElementById("reply_list_pnl");
	 					let replyData = "";
	 					replyListPnl.innerHTML = ""; // 댓글 목록 초기화
	 					
	 					for (let reply of resData) {
	 						
	 						// 날짜 포매팅(형식화)
	 						let replyFormattedBoardDate = reply.boardDate;
	 					
	 						/* ------------------------------------------------------------------------------------------------------ */
	 									 
							// 개별 게시글 동적 패널
							replyData = `<div id="reply_${reply.boardNum}" class="border-bottom border-dark-1 bg-light w-100 ps-4">
											
											<div class="d-flex flex-row py-2">
											
												<!-- 사람 아이콘 -->
												<div class="me-2">
												
													<i class="bi bi-person-circle" style="font-size:3em; color:#ccc"></i>
													
												</div>
												<!--// 사람 아이콘 -->
												
												<!-- 작성자 : bootstrap badge(뱃지) 적용 -->
												<!-- 참고 : https://getbootstrap.com/docs/5.3/components/badge/#positioned -->
												
												<!-- 실제 댓글 작성자 파악을 위해 id 등록 -->
												<div id="reply_actual_writer_${reply.boardNum}" class="d-flex align-items-center ms-1 mt-1">
												
													<!-- 실제 댓글 작성자 파악을 위해 id 등록 -->	
													<button id="reply_writer_${reply.boardWriter}" type="button" class="btn btn-info position-relative">
														
														${reply.boardWriter}
														
													  	<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
													    	작성자
													    	<span class="visually-hidden">unread messages</span>
													  	</span>
													  	
													</button>
																							
												</div>
												<!--// 작성자 -->
												
											</div>
										
											<!-- 댓글 내용 -->										
											<div class="my-1 d-flex flow">
											
												<!-- 댓글 제어의 원활하게 하기 위해 div에 ID 할당 -->
												<div id="boardContent_${reply.boardNum}">
													${reply.boardContent}
												</div>
												
											</div>
											<!--// 댓글 내용 -->
											
											<!-- ///////////////////////////////////////////////////////////////// -->
									
											<!-- 댓글 작성일,  댓글 수정/삭제 메뉴 : 2024.3(이관) -->
											<div class="my-1 d-flex flow row">
											
												<div class="col-4 pt-1">
													${replyFormattedBoardDate}
												</div>
												
												<!-- 메뉴 추가(이동) : 댓글 수정/삭제 : 2024.3 -->
												<div class="col-8 d-flex justify-content-end">
												
													<a href="#" id="reply_update_btn_${reply.boardNum}" class="btn btn-sm btn-outline-primary me-2 mb-1" 
													   onClick="updateReply(${originalBoardId}, ${reply.boardNum}, '${boardWriter}')">수정</a>
										
													<a href="#" id="reply_delete_btn_${reply.boardNum}" class="btn btn-sm btn-outline-primary mb-1 me-3"
													   onClick="deleteReply(${originalBoardId}, ${reply.boardNum}, '${boardWriter}')">삭제</a>
									
												</div>
												<!--// 메뉴 추가(이동) : 댓글 수정/삭제 : 2024.3 -->
												
											</div>
											<!--// 댓글 작성일 -->
											
											<!-- ///////////////////////////////////////////////////////////////// -->
											
										</div>`;
	 												
							/* ------------------------------------------------------------------------------------------------------ */
	 						
	 						
	 						replyListPnl.innerHTML += replyData;	
	 						
	 					} // for
	 					
	 				 })	 				 
	 				 .catch(function(err) {
	 					console.error("댓글 작성 중 서버 에러가 발견되었습니다.");
	 				 }); // axios			  
	 				
	 			} // if (replyWriteForm.value.length > 100)	
	 		
			} // 패쓰워드 점검
		
		} //로그인 여부 점검
		
	}); // replyWriteBtn.addEventListener('click', function(e) { ...		
	
} //

/* **************************************************************************************************** */

// 댓글 수정 : 2024.3 : 댓글 수정 버튼의 댓글 영역 내로 이관된 조치에 따른 후속 조치(수정)
function updateReply(originalBoardId, replyBoardId, boardWriter) {
	
	console.log("원글 아이디, 댓글 아이디, 글 작성자 : " + originalBoardId + "," + replyBoardId +"," + boardWriter);
	
	// 수정할 기존 댓글 내용
	let boardContent = document.getElementById("boardContent_" + replyBoardId);
	
	console.log("boardContent : ", boardContent.innerText.trim());
	
	// 댓글 수정을 위해 게시글 목록 해당 게시글 패널 하단에 입력 패널 생성 및 내용 삽입			
	let replyPnl = document.getElementById("reply_" + replyBoardId);
	
	// 이전 상태 복원 대비 위해 이전 등록 모드 상태 보전 : "취소" 버튼 클릭시 이전 상태 복원
	let oldReplyPnl = replyPnl.innerHTML;
	
	
	//////////////////////////////////////////////////////////////////////////////////
	
	// 버그 패치 : 2024.3
	// 기존의 댓글 수정 패널이 있다면 댓글 수정 패널이 추가되지 않도록 조치
	
	// 댓글 수정란 생성
	let replyUpdateForm = `<div id="reply_write_update_pnl_${replyBoardId}" class="my-3">
		 
								<textarea id="reply_update_form_${replyBoardId}" 
										  name="reply_update_form_${replyBoardId}" 
										  class="form-control border border-primary"
										  placeholder="댓글을  100자이내로 작성하십시오">${boardContent.innerText.trim()}</textarea>
							   
						   </div>`;
	
	// 댓글 수정 내용 전송 버튼 생성 : 수정용 패쓰워드 입력란 포함
	let replySubmitBtns = `<div id="reply_submit_btns_${replyBoardId}" class="d-flex justify-content-end my-2">
	
							 <input type="text" id="board_pass_${replyBoardId}" 
								    id="board_pass_${replyBoardId}" required 
								    class="form-control form-control-sm h-100 w-25 me-3">
						  	
							 <button type="button" 
						 	 	 id="reply_submit_btn_${replyBoardId}"
						  		 class="btn btn-sm btn-primary me-2">등록</button>
							
							 <button type="button" 
						 	 	 id="reply_reset_btn_${replyBoardId}"
						  		 class="btn btn-sm btn-primary me-2">취소</button>
						
						  </div>`;
	
	
	// 기존의 패널이 없을 경우에만 추가
	if (document.getElementById(`reply_write_update_pnl_${replyBoardId}`) == null) {
		
		replyPnl.innerHTML += replyUpdateForm;
		replyPnl.innerHTML += replySubmitBtns;
	} //			
				
	
	//////////////////////////////////////////////////////////////////////////////////////
	
	// 댓글 수정 (전송)등록 버튼을 클릭시
	let replySubmitBtn = document.getElementById("reply_submit_btn_" + replyBoardId);
				
	replySubmitBtn.onclick = () => {
		
		alert("댓글 수정 전송")
		
		let replyUpdateForm = document.getElementById(`reply_update_form_${replyBoardId}`);
		
		// 실제 댓글 작성자 : 아래의 작성자 패널의 예시에서 처럼 실제 작성자가 
		// selector(선택자)를 활용하여 해당 요소를 검색할 경우
		// "#reply_actual_writer_109 button"와 같이 id값으로  
		// 추출하면 실제 작성자의 값을 조회할 수 있습니다.
		
		// 주의) 실제 댓글 작성자와 현재 댓글 작성을 시도하는 회원의 아이디를 
		// 비교하여 다르면 작성하지 못하도록 차단해야 됩니다.
		//        
		/****** ex)
		
		<div id="reply_actual_writer_109" class="d-flex align-items-center ms-1 mt-1">
								
			<button id="reply_writer_springspring1234" type="button" class="btn btn-info position-relative">
				
				springspring1234
				
			  	<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
			    	작성자
			    	<span class="visually-hidden">unread messages</span>
			  	</span>
			  	
			</button>
													
		</div>
		
		*******/
		
		let replyActualWriter = document.querySelector(`#reply_actual_writer_${replyBoardId} button`).id;
		
		replyActualWriter = replyActualWriter.substring("reply_writer_".length); // 실제 작성자 아이디 추출				
		
		console.log("작성자 아이디 : ", boardWriter);
		console.log("실제 작성자 아이디 : ", replyActualWriter);
		
		
		// 댓글 폼점검 : 비어 있는지 여부 점검				
		if (replyUpdateForm.value.trim() == "") {
			
			alert("댓글 내용이 없습니다. 다시 입력하십시오.");
			replyUpdateForm.value = ""; // 값 초기화
			replyUpdateForm.focus(); // 입력 대기
			
		} else if (replyActualWriter != boardWriter) { // 회원이 실제 댓글 작성자가 아니라면 차단 !
			
		 	console.log("작성자 아이디 : ", boardWriter);
			console.log("실제 작성자 아이디 : ", replyActualWriter);
			
			alert("실제 댓글 작성자만 댓글을 수정할 수 있습니다.");
			
			// 2024.3 : 추가) 원상 복구
			replyPnl.innerHTML = oldReplyPnl;
			
			// 댓글 작성란도 원상 복구
			document.getElementById("reply_write_form").innerHTML = "";
			document.getElementById(`board_pass_${originalBoardId}`).value = "";
			
		} else { // 전송
		
			let boardUpdatePass = document.getElementById(`board_pass_${replyBoardId}`);
			
			console.log("수정할 댓글의 아이디 : ", replyBoardId);
			console.log("수정할 댓글의 '원글' 아이디 : ", originalBoardId);
			console.log("작성자 아이디 : ", boardWriter);
			console.log("수정할 댓글 패쓰워드 : ", boardUpdatePass.value);
			console.log("댓글 내용 : ", replyUpdateForm.value.trim());
			
			alert("최종점검");
			
			if (boardUpdatePass.value.trim() == '') { 
				
				alert("댓글 패쓰워드를 입력하십시오");
				boardUpdatePass.focus();
				
			} else {	
			
				// 전송	
				// 주의) 여기서 boardNum 댓글 자체의 아이디입니다.		  
 				axios.post('/memberProject/board/replyUpdate.do', 
 					{
					    boardNum : replyBoardId,
						boardContent : replyUpdateForm.value,
						boardWriter : boardWriter,
						boardPass : boardUpdatePass.value,
						boardReRef : originalBoardId,
 					}
 				)
 				 .then(function(response) {
 					
 					let resData = response.data;
 					console.log("response.data : ", resData);

 					// 전체 댓글 현황 리턴 확인
 					console.log("전체 댓글 수 : ", resData.length);
 					
 					let replyListPnl = document.getElementById("reply_list_pnl");
 					let replyData = "";
 					replyListPnl.innerHTML = ""; // 댓글 목록 초기화
 					
 					for (let reply of resData) {
 						
 						// 날짜 포매팅(형식화)
 						let replyFormattedBoardDate = reply.boardDate;
 					
 						///////////////////////////////////////////////////////////////////////////////////////////////////////
 									 
						// 개별 게시글 동적 패널
						replyData = `<div id="reply_${reply.boardNum}" class="border-bottom border-dark-1 bg-light w-100 ps-4">
										
										<div class="d-flex flex-row py-2">
										
											<!-- 사람 아이콘 -->
											<div class="me-2">
											
												<i class="bi bi-person-circle" style="font-size:3em; color:#ccc"></i>
												
											</div>
											<!--// 사람 아이콘 -->
											
											<!-- 작성자 : bootstrap badge(뱃지) 적용 -->
											<!-- 참고 : https://getbootstrap.com/docs/5.3/components/badge/#positioned -->
											<!-- 실제 댓글 작성자 파악을 위해 id 등록 -->
											<div id="reply_actual_writer_${reply.boardNum}" class="d-flex align-items-center ms-1 mt-1">
											
												<!-- 실제 댓글 작성자 파악을 위해 id 등록 -->	
												<button id="reply_writer_${reply.boardWriter}" type="button" class="btn btn-info position-relative">
													
													${reply.boardWriter}
													
												  	<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
												    	작성자
												    	<span class="visually-hidden">unread messages</span>
												  	</span>
												  	
												</button>
																						
											</div>
											<!--// 작성자 -->
											
										</div>
									
										<!-- 댓글 내용 -->										
										<div class="my-1 d-flex flow">
										
											<!-- 댓글 제어의 원활하게 하기 위해 div에 ID 할당 -->
											<div id="boardContent_${reply.boardNum}">
												${reply.boardContent}
											</div>
											
										</div>
										<!--// 댓글 내용 -->
										
										<!-- ///////////////////////////////////////////////////////////////// -->
								
										<!-- 댓글 작성일,  댓글 수정/삭제 메뉴 : 2024.3(이관) -->
										<div class="my-1 d-flex flow row">
										
											<div class="col-4 pt-1">
												${replyFormattedBoardDate}
											</div>
											
											<!-- 메뉴 추가(이동) : 댓글 수정/삭제 : 2024.3 -->
											<div class="col-8 d-flex justify-content-end">
											
												<a href="#" id="reply_update_btn_${reply.boardNum}" class="btn btn-sm btn-outline-primary me-2 mb-1" 
												   onClick="updateReply(${originalBoardId}, ${reply.boardNum}, '${boardWriter}')">수정</a>
									
												<a href="#" id="reply_delete_btn_${reply.boardNum}" class="btn btn-sm btn-outline-primary mb-1 me-3"
												   onClick="deleteReply(${originalBoardId}, ${reply.boardNum}, '${boardWriter}')">삭제</a>
								
											</div>
											<!--// 메뉴 추가(이동) : 댓글 수정/삭제 : 2024.3 -->
											
										</div>
										<!--// 댓글 작성일 -->
										
										<!-- ///////////////////////////////////////////////////////////////// -->
										
									</div>`;
 												
						//////////////////////////////////////////////////////////////////////////////////////////////////
 						
 						
 						replyListPnl.innerHTML += replyData;	
 						
 					} // for
 					
 				 })	 				 
 				 .catch(function(err) {
 					console.error("댓글 작성 중 서버 에러가 발견되었습니다.");
					
					// 에러 처리
					console.log(err.response.data);
					console.log(err.response.status);
					
					if (err.response.status == 401) {
						alert("게시글 패쓰워드가 일치하지 않습니다.");								
					}
				
 				 }); // axios			  
		
			} // if (boardUpdatePass.value.trim() == '') { ....
			
		} // if (replyUpdateForm.value.trim() == "") { ....
		
		
		// 댓글 전송 => 댓글 작성자 아이디/패쓰워드 비교
	
	} //
	
	// 댓글 수정 (전송)취소 버튼을 클릭시
	let replyResetBtn = document.getElementById("reply_reset_btn_" + replyBoardId);
	
	// 댓글 수정 취소 버튼을 클릭시 
	replyResetBtn.onclick = () => {
		
		alert("댓글 수정 취소");
						
		// 원상 복구 : 원래의 일반 댓글 등록 모드로 변경				
		replyPnl.innerHTML = oldReplyPnl;
		
		// 댓글 작성란도 원상 복구
		document.getElementById("reply_write_form").innerHTML = "";
		document.getElementById(`board_pass_${originalBoardId}`).value = "";
	} //
			
}


/* **************************************************************************************************** */

// 댓글 삭제 : 2024.3 : 댓글 삭제 버튼의 댓글 영역 내로 이관된 조치에 따른 후속 조치(수정)
function deleteReply(originalBoardId, replyBoardId, boardWriter) {

	console.log("원글 아이디, 댓글 아이디, 글 작성자 : " + originalBoardId + "," + replyBoardId +"," + boardWriter);
	
	// 댓글 삭제를 위해 게시글 목록 해당 게시글 패널 하단에 입력 패널 생성 및 내용 삽입			
	let replyPnl = document.getElementById("reply_" + replyBoardId);
	
	// 이전 상태 복원 대비 위해 이전 등록 모드 상태 보전 : "취소" 버튼 클릭시 이전 상태 복원
	let oldReplyPnl = replyPnl.innerHTML;
	
	// 댓글 삭제 및 전송 버튼 생성 : 삭제용 패쓰워드 입력란 포함
	let replySubmitBtns = `<div id="reply_submit_btns_${replyBoardId}" class="d-flex justify-content-end my-2">
	
							 <input type="text" id="board_pass_${replyBoardId}" 
								    id="board_pass_${replyBoardId}" required 
								    class="form-control form-control-sm h-100 w-25 me-3">
						  	
							 <button type="button" 
						 	 	 id="reply_submit_btn_${replyBoardId}"
						  		 class="btn btn-sm btn-primary me-2">삭제 전송</button>
							
							 <button type="button" 
						 	 	 id="reply_reset_btn_${replyBoardId}"
						  		 class="btn btn-sm btn-primary me-2">취소</button>
						
						  </div>`;
				
	// 기존의 패널이 없을 경우에만 추가
	if (document.getElementById(`reply_write_update_pnl_${replyBoardId}`) == null) {		
		replyPnl.innerHTML += replySubmitBtns;
	} //			
	
	// 실제 댓글 작성자 : 아래의 작성자 패널의 예시에서 처럼 실제 작성자가 
	// selector(선택자)를 활용하여 해당 요소를 검색할 경우
	// "#reply_actual_writer_109 button"와 같이 id값으로  
	// 추출하면 실제 작성자의 값을 조회할 수 있습니다.
	
	// 주의) 실제 댓글 작성자와 현재 댓글 작성을 시도하는 회원의 아이디를 
	// 비교하여 다르면 작성하지 못하도록 차단해야 됩니다.
	//        
	/****** ex)
	
	<div id="reply_actual_writer_109" class="d-flex align-items-center ms-1 mt-1">
							
		<button id="reply_writer_springspring1234" type="button" class="btn btn-info position-relative">
			
			springspring1234
			
		  	<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
		    	작성자
		    	<span class="visually-hidden">unread messages</span>
		  	</span>
		  	
		</button>
												
	</div>
	
	*******/
	
	let replyActualWriter = document.querySelector(`#reply_actual_writer_${replyBoardId} button`).id;
	
	replyActualWriter = replyActualWriter.substring("reply_writer_".length); // 실제 작성자 아이디 추출			
				
	
	//////////////////////////////////////////////////////////////////////////////////////
	
	// 댓글 삭제 (전송)등록 버튼을 클릭시
	let replySubmitBtn = document.getElementById("reply_submit_btn_" + replyBoardId);
				
	replySubmitBtn.onclick = () => {	
		
		//로그인 미인증 시 로그인 페이지 이동
		if (boardWriter == 'anonymousUser'){
		
			alert("댓글 작성을 위해서 로그인이 필요합니다.");
			location.href = "/memberProject/login";
		}			
	
		// 댓글 폼점검 : 비어 있는지 여부 점검
		// 유의) 여기서는 "댓글 삭제" 버튼을 직접 이용하기 때문에 원글(boardNum) 버튼을 활용 
		let boardDeletePass = document.getElementById(`board_pass_${replyBoardId}`);
		
		if (replyActualWriter != boardWriter) { // 회원이 실제 댓글 작성자가 아니라면 차단 !
			
		 	console.log("작성자 아이디 : ", boardWriter);
			console.log("실제 작성자 아이디 : ", replyActualWriter);
			
			alert("실제 댓글 작성자만 댓글을 삭제할 수 있습니다.");
			
			// 2024.3 : 추가) 원상 복구
			replyPnl.innerHTML = oldReplyPnl;
			
		} else { // 회원이 실제 댓글 작성자라면...
		
			if (boardDeletePass.value.trim() == '') { 
							
				alert("댓글 패쓰워드를 입력하십시오");
				boardDeletePass.focus();
				
			} else {	
				
				alert("삭제 전송");
				
				console.log("-- replyBoardId : ", replyBoardId);			
				console.log("-- originalBoardId : ", originalBoardId);
				console.log("-- boardDeletePass.value : ", boardDeletePass.value);
				
				// 삭제를 위한 AJAX 전송
				// 삭제할 댓글 아이디와 댓글 부모글(원글) 아이디 : 원글은 삭제 후 댓글 목록의 현황 갱신을 위한 전송 
				axios.post(`/memberProject/board/replyDelete.do`,
				{
					boardNum : replyBoardId, // 삭제할 댓글 아이디
					originalBoardNum : originalBoardId, // 댓글 목록 갱신을 위한 원글 아이디
					boardPass : boardDeletePass.value // 삭제할 댓글 패쓰워드
					
				}) 
				 .then(function(response) {
					 
					let resData = response.data;
					console.log("response.data : ", resData);
		
					// 전체 댓글 현황 리턴 확인
					console.log("전체 댓글 수 : ", resData.length);
					
					let replyListPnl = document.getElementById("reply_list_pnl");
					
					// 기존 패널 비우기(초기화)
					replyListPnl.innerHTML = "";
					
					let replyData = "";
					
					for (let reply of resData) {
		
						// 날짜 포매팅(형식화)
						let replyFormattedBoardDate = reply.boardDate;
						
						/* ------------------------------------------------------------------------------------------------------ */
						
						// 개별 게시글 동적 패널
						replyData = `<div id="reply_${reply.boardNum}" class="border-bottom border-dark-1 bg-light w-100 ps-4">
										
										<div class="d-flex flex-row py-2">
										
											<!-- 사람 아이콘 -->
											<div class="me-2">
											
												<i class="bi bi-person-circle" style="font-size:3em; color:#ccc"></i>
												
											</div>
											<!--// 사람 아이콘 -->
											
											<!-- 작성자 : bootstrap badge(뱃지) 적용 -->
											<!-- 참고 : https://getbootstrap.com/docs/5.3/components/badge/#positioned -->
											
											<!-- 실제 댓글 작성자 파악을 위해 id 등록 -->
											<div id="reply_actual_writer_${reply.boardNum}" class="d-flex align-items-center ms-1 mt-1">
											
												<!-- 실제 댓글 작성자 파악을 위해 id 등록 -->	
												<button id="reply_writer_${reply.boardWriter}" type="button" class="btn btn-info position-relative">
													
													${reply.boardWriter}
									
												  	<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
												    	작성자
												    	<span class="visually-hidden">unread messages</span>
												  	</span>
												  	
												</button>
																						
											</div>
											<!--// 작성자 -->
											
										</div>
									
										<!-- 댓글 내용 -->	
										<div class="my-1 d-flex flow">
										
											<div style="width:25px;">
												&nbsp;
											</div>
											
											<!-- 댓글 제어의 원활하게 하기 위해 div에 ID 할당 -->
											<div id="boardContent_${reply.boardNum}">
												${reply.boardContent}
											</div>
											
										</div>
										<!--// 댓글 내용 -->
										
										<!-- ///////////////////////////////////////////////////////////////// -->
								
										<!-- 댓글 작성일,  댓글 수정/삭제 메뉴 : 2024.3(이관) -->
										<div class="my-1 d-flex flow row">
										
											<div class="col-4 pt-1">
												${replyFormattedBoardDate}
											</div>
											
											<!-- 메뉴 추가(이동) : 댓글 수정/삭제 : 2024.3 -->
											<div class="col-8 d-flex justify-content-end">
											
												<a href="#" id="reply_update_btn_${reply.boardNum}" class="btn btn-sm btn-outline-primary me-2 mb-1" 
												   onClick="updateReply(${originalBoardId}, ${reply.boardNum}, '${boardWriter}')">수정</a>
									
												<a href="#" id="reply_delete_btn_${reply.boardNum}" class="btn btn-sm btn-outline-primary mb-1 me-3"
												   onClick="deleteReply(${originalBoardId}, ${reply.boardNum}, '${boardWriter}')">삭제</a>
								
											</div>
											<!--// 메뉴 추가(이동) : 댓글 수정/삭제 : 2024.3 -->
											
										</div>
										<!--// 댓글 작성일 -->
										
										<!-- ///////////////////////////////////////////////////////////////// -->
										
									</div>`;
									
						/* ------------------------------------------------------------------------------------------------------ */
						
						replyListPnl.innerHTML += replyData;	
						
					} // for
				
				 })	 				 
				 .catch(function(err) {
					console.error("댓글 삭제 중 서버 에러가 발견되었습니다.");
					
					// 에러 처리
					console.log(err.response.data);
					console.log(err.response.status);
					
					if (err.response.status == 401) {
						alert("게시글 패쓰워드가 일치하지 않습니다.");								
					}
				 }); // axios			  
				
			
			} // if (boardUpdatePass.value.trim() == '') { 	 
				
		} //
	
	} // 회원이 실제 댓글 작성자라면...	
	
	// 댓글 삭제 (전송)취소 버튼을 클릭시
	let replyResetBtn = document.getElementById("reply_reset_btn_" + replyBoardId);
	
	// 댓글 수정 취소 버튼을 클릭시 
	replyResetBtn.onclick = () => {
		
		alert("댓글 삭제 취소");
						
		// 원상 복구 : 원래의 일반 댓글 등록 모드로 변경				
		replyPnl.innerHTML = oldReplyPnl;
		
		// 댓글 작성란도 원상 복구
		document.getElementById("reply_write_form").innerHTML = "";
		document.getElementById(`board_pass_${originalBoardId}`).value = "";
	} //			
	
} //

/* **************************************************************************************************** */

// (원)글 삭제
function deleteBoard(boardNum, boardWriter) {
	
	// console.log("boardNum : ", boardNum, ", boardWriter : ", boardWriter);
	// console.log("삭제할 게시글(원글) 아이디 : ",boardNum);
	
	// 게시글 삭제 버튼
	let boardDeleteBtn = document.getElementById(`board_delete_btn_${boardNum}`);
	
	// 삭제할 게시글 패쓰워드
	let boardDeletePass = document.getElementById(`board_pass_${boardNum}`);
	
	boardDeleteBtn.onclick = function() {
		
		console.log("삭제할 게시글 아이디 : ", boardNum);
		console.log("삭제할 게시글 패쓰워드 : ", boardDeletePass.value);
		
		// 게시글 삭제 의사 재점검
		if (confirm("정말 삭제하시겠습니까?") == true) {
		
			// 패쓰워드 폼점검
			if (boardDeletePass.value.trim() == '') {
				
				alert("패쓰워드를 입력하십시오.")
				
			} else {
				
				// 전송
				// 삭제를 위한 AJAX 전송
				// 삭제할 게시글 아이디
				
				//////////////////////////////////////////////////////////////////////////
				// 
				// 주의사항) 특수문자(#)이 포함된 boardPass 인자 전송할 경우 => encodeURIComponent 활용 !
				//  
				let encodedPass = encodeURIComponent(boardDeletePass.value);
				
				let str = `/memberProject/board/deleteProc.do?boardNum=${boardNum}&boardPass=${encodedPass}`;
				
				console.log('str : ', str);
				
				location.href = str;
				
			} // if
		
		} else {
			
			alert("게시글 삭제를 취소하였습니다.");
			
		} // if (confirm("정말 삭제하시겠습니까?") == true	
		
	} // boardDeleteBtn.onclick

} //