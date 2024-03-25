-- 검색 

SELECT COUNT(*) FROM member_tbl
WHERE road_address like '%관악%'
OR jibun_address like '%관악%'
OR detail_address like '%관악%';

SELECT  *
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
			 and road_address like '%관악%'
		     OR jibun_address like '%관악%'
		     OR detail_address like '%관악%'
             ORDER BY id DESC
          ) m  
      )  
WHERE page = 1;