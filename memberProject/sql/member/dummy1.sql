-- 회원 정보 테이블 회원 더미 정보 생성
-- 패쓰워드 원래 값 : #Abcd1234 

-- 참고)
-- 임의의 수(random) : 1 => 'm', 2 => 'f'
  
/*
SELECT ROUND(DBMS_RANDOM.VALUE(1,2),0) FROM DUAL;
SELECT DECODE((SELECT ROUND(DBMS_RANDOM.VALUE(1,2),0) FROM DUAL), 1, 'm', 2, 'f') FROM DUAL;  
*/

DELETE MEMBER_TBL;


DECLARE
    
    temp_random_gender NUMBER(1); 
    v_gender CHAR(1);
    
BEGIN
 
    FOR i IN 1..100 LOOP
    
        -- 성별 생성
        temp_random_gender := round(DBMS_RANDOM.VALUE(1, 2), 0);        
        SELECT DECODE(temp_random_gender, 1, 'm', 2, 'f') INTO v_gender FROM dual; 
    
        INSERT INTO member_tbl VALUES
        ('ezen' || (1000+i),
         '$2a$10$owcQ8pNZJdViGHJks4d2b.gjNIQb5cwbYBs8Yd7O3yuG6Q612dOae',
         '김' || (100+i),
         v_gender,
         'ezen' || i || '@abcd.com',
         '010-1234-' || (1000+i),
         '02-860-1234',
         '08290',  
         '서울 관악구 남부순환로 1633',         
         '서울특별시 관악구 신림동 1433-120번지',
         '이젠컴퓨터아카데미 별관 801호',
         '2000-01-01',
         SYSDATE,
         1);

     END LOOP;
 
    COMMIT;    
END;
/