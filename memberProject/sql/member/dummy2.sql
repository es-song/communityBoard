SET SERVEROUTPUT ON; -- 실행 결과 화면 출력

-- 회원 정보 테이블 회원명(이름) 현실화

DECLARE
	TYPE first_name_array      IS VARRAY(50) OF NVARCHAR2(4);  
	TYPE middle_name_array      IS VARRAY(20) OF NVARCHAR2(1);  
	TYPE last_name_array      IS VARRAY(20) OF NVARCHAR2(1);  
	first_names   first_name_array;  
	middle_names   middle_name_array;  
	last_names   last_name_array;        
	v_first_name NVARCHAR2(4);  
	v_middle_name NVARCHAR2(1);  
	v_last_name NVARCHAR2(1);  
	total_name NVARCHAR2(6);  
	temp_num NUMBER(2); 
      
BEGIN  
	first_names := first_name_array('김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황','안','송','류','전','홍','고','문','양','손','배','허','유','남','심','노','하','곽','성','차','주','우','구','도','추','민','소','남궁','독고','사공','제갈','선우','서문','동방','황보');  
	middle_names := middle_name_array('숙','갑','영','순','선','원','우','이','운','성','정','희','민','승','강','구','남','나','만','상');  
	last_names := last_name_array('영','수','희','빈','민','정','순','주','연','영','철','석','인','섭','훈','재','제','한','준','환');  
       
	FOR i IN 1..100 LOOP  
         
        temp_num := round(DBMS_RANDOM.VALUE(1,50),0);  
        v_first_name :=  first_names(temp_num);  
        temp_num := round(DBMS_RANDOM.VALUE(1,20),0);  
        v_middle_name :=  middle_names(temp_num);  
        temp_num := round(DBMS_RANDOM.VALUE(1,20),0);  
        v_last_name :=  last_names(temp_num);  
        total_name := v_first_name || ' ' || v_middle_name || v_last_name;  -- 성함 띄워쓰기 적용
                         
        UPDATE member_tbl SET name = total_name  
        WHERE id = 'ezen' || (1000+i);       
        
	END LOOP;  

	COMMIT;         
      
END;  
/  