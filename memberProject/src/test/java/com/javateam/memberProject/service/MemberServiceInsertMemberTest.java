package com.javateam.memberProject.service;

import static org.junit.jupiter.api.Assertions.*;

import java.text.SimpleDateFormat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import com.javateam.memberProject.domain.MemberDTO;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@Slf4j
class MemberServiceInsertMemberTest {
	
	@Autowired
	MemberService memberService;
	
	MemberDTO memberDTO;

	@BeforeEach
	void setUp() throws Exception {
		
		memberDTO = MemberDTO.builder()
	  			 .id("pythondata111")
	  			 .password("$2a$10$1t3vaIa5jtsMp2RY9y7xhuJz0xDRNEl0csvPYvgCbyKuKeyOVucES")
	  			 .name("황 선우")
	  			 .gender("m")
	  			 .email("swimgoldenboy@abcd.com")
	  			 .mobile("010-8282-7979")
	  			 .phone("02-777-8888")
	  			 .zip("08290")
	  			 .roadAddress("서울특별시 관악구 남부순환로 1633 (신림동)")
	  			 .jibunAddress("서울특별시 관악구 신림동 1422-6")
	  			 .detailAddress("이젠아카데미 신림점 별관 8층")
	  			 .birthday(new SimpleDateFormat("yyyy-MM-dd").parse("2001-11-30"))
	  			 .build();
	}

	@Transactional
	// @Rollback(true)
	@Rollback(false)
	@Test
	void testInsertMemberRole() {
		
		log.info("MemberServiceInsertMemberTest");
		assertTrue(memberService.insertMemberRole(memberDTO));
	}

}
