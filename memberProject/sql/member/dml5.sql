-- 전체 회원 조회 : 페이징
-- 페이지 당 10명 씩 조회
SELECT  id,
		password,
		name,	
		gender,
		email,
		mobile,
		phone,
		zip,
		road_address as "roadAddress",
		jibun_address as "jibunAddress",
		detail_address as "detailAddress",
		birthday,
		joindate,		
		enabled,
        page
FROM (SELECT m.*,  
             FLOOR((ROWNUM - 1) / 10 + 1) page  
      FROM (
             SELECT *
			 FROM member_tbl
             ORDER BY id DESC
           ) m  
      )  
WHERE page = 1;