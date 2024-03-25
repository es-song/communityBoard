SET SERVEROUTPUT ON;

DECLARE 
    v_year CHAR(4);
    v_month CHAR(2);
    v_date CHAR(2);   
    temp_birthday CHAR(10);    
    temp_month NUMBER(2);
    temp_date NUMBER(2);
BEGIN

    FOR i IN 1..100 LOOP
    
        v_year := TO_CHAR(round(DBMS_RANDOM.VALUE(1900,2023),0));
        
        temp_month := round(DBMS_RANDOM.VALUE(1,12),0);
        temp_date := round(DBMS_RANDOM.VALUE(1,31),0);
        
        -- 2월
        IF temp_month = 2 THEN
            temp_date := round(DBMS_RANDOM.VALUE(1,27),0);
        END IF;
                
        IF temp_month < 10 THEN
            v_month := '0' || TO_CHAR(temp_month); 
        ELSE
            v_month := TO_CHAR(temp_month); 
        END IF;
            
        IF temp_date < 10 THEN
            v_date :=  '0' || TO_CHAR(temp_date);
        ELSE 
            v_date := TO_CHAR(temp_date);
        END IF;    
        
        temp_birthday := TRIM(v_year || '-' || v_month || '-' || v_date);
            
        -- DBMS_OUTPUT.put_line(temp_birthday);        
        
        UPDATE member_tbl SET birthday = TO_DATE(temp_birthday)    
        WHERE id = 'ezen' || (1000+i);
        
        COMMIT;
          
    END LOOP;

END;
/