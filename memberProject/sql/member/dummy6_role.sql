-- ROLE 정보 생성
DECLARE
BEGIN
 
    FOR i IN 1..100 LOOP
    
        INSERT INTO user_roles VALUES
        (
         user_roles_seq.nextval,
         'ezen' || (1000+i),        
		 'ROLE_USER'
         );

     END LOOP;
 
    COMMIT;    
END;
/