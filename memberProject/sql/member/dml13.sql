-- 회원 정보 검색

SELECT  id,
		password,
		name,	
		gender,
		email,
		mobile,
		phone,
		zip,
		road_address,
		jibun_address,
		detail_address,
		birthday,
		joindate,		
		enabled,
		role,
        page   
FROM (SELECT m.*,  
             FLOOR((ROWNUM - 1) / 10 + 1) page  
      FROM (
	      	 SELECT 
	      	 DISTINCT m.*,
			 (
			    SELECT LISTAGG(r2.role, ',') WITHIN GROUP (ORDER BY m2.id) 
			    FROM member_tbl m2, user_roles r2  
			    WHERE r2.username = m2.id
			    AND r2.username = m.id
			 ) AS "ROLE"           
			 FROM member_tbl m, user_roles r
			 WHERE m.id = r.username
				 AND joindate like '%2013-05-15%'    		  
             ORDER BY id DESC
          ) m  
      )  
WHERE page = 1