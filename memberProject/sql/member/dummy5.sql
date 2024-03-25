SET SERVEROUTPUT ON;

-- 회원 정보 테이블 우편번호/주소 정보 현실화

-- 정부 주소 검색 서비스 : https://www.juso.go.kr/
-- 다음 주소 검색 서비스 :  https://postcode.map.daum.net/guide

-- 참고로, 도로명 주소 표기를 다음(duam) 주소검색 서비스에 맞추고자 도로명 주소 
-- (   ) 속의 동 표시를 제거하였습니다. 

-- 정부 주소 검색 ex) 서울특별시 구로구 새말로9길 45 (구로동, 신도림현대아파트)
-- 다음 주소 검색 ex) 서울특별시 구로구 새말로9길 45 (신도림현대아파트) 

-- 만약 정부 주소 검색에 맞추고자 한다면 도로명 주소의 길이 및 지번 주소의 길이 필드 제한 수를 조정해야 됩니다.
-- 넉넉히 50자 분량으로 잡았습니다.
ALTER TABLE member_tbl MODIFY(road_address NVARCHAR2(50));
ALTER TABLE member_tbl MODIFY(jibun_address NVARCHAR2(50));

-- 08291
-- 서울특별시 구로구 새말로9길 45 (구로동, 신도림현대아파트)
-- 서울특별시 구로구 구로동 560 신도림현대아파트
-- 상세주소 범위 : 101~103동 1~19층 ex) 1901호

-- 08288
-- 서울특별시 구로구 새말로 93 (구로동, 신도림태영타운)
-- 서울특별시 구로구 구로동 1267 신도림태영타운
-- 상세주소 범위 : 101~113동 1~16층 ex) 1601호

-- 07376
-- 서울특별시 영등포구 도신로 31 (대림동, 현대3차아파트)
-- 서울특별시 영등포구 대림동 608-1 현대3차아파트
-- 상세주소 범위 : 301~307동 1~30층 ex) 2801호

-- 08208 
-- 서울특별시 구로구 경인로65길 16-15 (신도림동, 신도림4차 e-편한세상)
-- 서울특별시 구로구 신도림동 646 신도림4차 e-편한세상
-- 상세주소 범위 : 1101~1115동 1~25층 ex) 2501호

-- 08750
-- 서울특별시 관악구 봉천로 387 (봉천동, 두산아파트)
-- 서울특별시 관악구 봉천동 1708 두산아파트
-- 상세주소 범위 : 101~114동 1~23층  ex) 1401호

-- 08770
-- 서울특별시 관악구 남부순환로 1430 (신림동, 신림푸르지오아파트)
-- 서울특별시 관악구 신림동 1730 신림푸르지오아파트
-- 상세주소 범위 : 101~123동 1~24층  ex) 1704호

-- 08845
-- 서울특별시 관악구 신림로29길 8 (신림동, 신림현대아파트)
-- 서울특별시 관악구 신림동 1694 신림현대아파트
-- 상세주소 범위 : 101~112동 1~15층 ex) 1406호

----------------------------------------------------

DECLARE
   
    TYPE APT_ADDRESS_RECORD IS RECORD (
        zip_code CHAR(5),
        road_address NVARCHAR2(50), -- 필드 길이 교정에 따른 길이 조정
        jibun_address NVARCHAR2(50), -- 필드 길이 교정에 따른 길이 조정
        detail_address NVARCHAR2(50)
    );
    
    TYPE APT_ADDRESS_TBL IS TABLE OF APT_ADDRESS_RECORD;
    
    apt_addresses APT_ADDRESS_TBL;
    
    temp_num NUMBER(1);
    
    temp_detail_address NVARCHAR2(50); -- 필드 길이 교정에 따른 길이 조정
    
    temp_dong NVARCHAR2(5);
    
    temp_ho NVARCHAR2(5);
    
    FUNCTION apt_address_record_constructor (
            zip_code CHAR,
            road_address NVARCHAR2,
            jibun_address NVARCHAR2,
            detail_address NVARCHAR2
        ) RETURN APT_ADDRESS_RECORD IS
        apt APT_ADDRESS_RECORD;
    BEGIN
        apt.zip_code := zip_code;
        apt.road_address := road_address;
        apt.jibun_address := jibun_address;
        apt.detail_address := detail_address;
        RETURN apt;
    END apt_address_record_constructor;          
 
BEGIN  
      
      apt_addresses := APT_ADDRESS_TBL(
    
            apt_address_record_constructor('08291',
                    '서울특별시 구로구 새말로9길 45 (구로동, 신도림현대아파트)',
                    '서울특별시 구로구 구로동 560 신도림현대아파트',
                    ''),
            apt_address_record_constructor('08288',
                    '서울특별시 구로구 새말로 93 (구로동, 신도림태영타운)',
                    '서울특별시 구로구 구로동 1267 신도림태영타운',
                    ''),
            apt_address_record_constructor('07376',
                    '서울특별시 영등포구 도신로 31 (대림동, 현대3차아파트)',
                    '서울특별시 영등포구 대림동 608-1 현대3차아파트',
                    ''),
            apt_address_record_constructor('08208',        
                    '서울특별시 구로구 경인로65길 16-15 (신도림동, 신도림4차 e-편한세상)',
                    '서울특별시 구로구 신도림동 646 신도림4차 e-편한세상',
                    ''),
            apt_address_record_constructor('08750',        
                    '서울특별시 관악구 봉천로 387 (봉천동, 두산아파트)',
                    '서울특별시 관악구 봉천동 1708 두산아파트',
                    ''),
            apt_address_record_constructor('08770',        
                    '서울특별시 관악구 남부순환로 1430 (신림동, 신림푸르지오아파트)',
                    '서울특별시 관악구 신림동 1730 신림푸르지오아파트',
                    ''),
            apt_address_record_constructor('08845',        
                    '서울특별시 관악구 신림로29길 8 (신림동, 신림현대아파트)',
                    '서울특별시 관악구 신림동 1694 신림현대아파트',
                    '')                
                    
      );      
      
    FOR i IN 1..100 LOOP  
         
        temp_num := round(DBMS_RANDOM.VALUE(1,7),0);  -- 주소의 종류에 따라 한계값 변경
        -- DBMS_OUTPUT.put_line('temp_num : ' ||  temp_num);
        
        -- 상세 주소 임의(random) 설정    
         /*
            -- 1번 :
            -- 08291
            -- 서울특별시 구로구 새말로9길 45 (구로동, 신도림현대아파트)
            -- 서울특별시 구로구 구로동 560 신도림현대아파트
            -- 상세주소 범위 : 101~103동 1~19층 ex) 1901호
            
            -- 2번 :
            -- 08288
            -- 서울특별시 구로구 새말로 93 (구로동, 신도림태영타운)
            -- 서울특별시 구로구 구로동 1267 신도림태영타운
            -- 상세주소 범위 : 101~113동 1~16층 ex) 1601호
           
            -- 3번 : 
            -- 07376
            -- 서울특별시 영등포구 도신로 31 (대림동, 현대3차아파트)
            -- 서울특별시 영등포구 대림동 608-1 현대3차아파트
            -- 상세주소 범위 : 301~307동 1~30층 ex) 2801호
            
            -- 4번 :
            -- 08208 
            -- 서울특별시 구로구 경인로65길 16-15 (신도림동, 신도림4차 e-편한세상)
            -- 서울특별시 구로구 신도림동 646 신도림4차 e-편한세상
            -- 상세주소 범위 : 1101~1115동 1~25층 ex) 2501호
            
            -- 5번 :
            -- 08750
            -- 서울특별시 관악구 봉천로 387 (봉천동, 두산아파트)
            -- 서울특별시 관악구 봉천동 1708 두산아파트
            -- 상세주소 범위 : 101~114동 1~23층  ex) 1401호
            
            -- 6번 :
            -- 08770
            -- 서울특별시 관악구 남부순환로 1430 (신림동, 신림푸르지오아파트)
            -- 서울특별시 관악구 신림동 1730 신림푸르지오아파트
            -- 상세주소 범위 : 101~123동 1~24층  ex) 1704호
            
            -- 7번 :
            -- 08845
            -- 서울특별시 관악구 신림로29길 8 (신림동, 신림현대아파트)
            -- 서울특별시 관악구 신림동 1694 신림현대아파트
            -- 상세주소 범위 : 101~112동 1~15층 ex) 1406호

        
            ex) 
            select round(DBMS_RANDOM.VALUE(10,19),0) || 
            round(DBMS_RANDOM.VALUE(0,1),0) || 
            round(DBMS_RANDOM.VALUE(1,9),0) || '동'
            from dual;
        */
            IF temp_num = 1 THEN          
            
                -- 상세주소 범위 : 101~103동 1~19층 ex) 1901호                
                temp_dong := round(DBMS_RANDOM.VALUE(101,103),0) || '동';
                 
                temp_ho := round(DBMS_RANDOM.VALUE(10,19),0) || 
                           round(DBMS_RANDOM.VALUE(0,1),0) || 
                           round(DBMS_RANDOM.VALUE(1,9),0) || '호';    
                               
             ELSIF temp_num = 2 THEN
             
                -- 상세주소 범위 : 101~113동 1~16층 ex) 1601호
                temp_dong := round(DBMS_RANDOM.VALUE(101,113),0) || '동';
                
                temp_ho := round(DBMS_RANDOM.VALUE(10,16),0) || 
                           round(DBMS_RANDOM.VALUE(0,1),0) || 
                           round(DBMS_RANDOM.VALUE(1,9),0) || '호';    
                
             ELSIF temp_num = 3 THEN
             
                    -- 상세주소 범위 : 301~307동 1~30층 ex) 2801호                
                    temp_dong := round(DBMS_RANDOM.VALUE(301,307),0) || '동';
                    
                    temp_ho := round(DBMS_RANDOM.VALUE(10,30),0) || 
                               round(DBMS_RANDOM.VALUE(0,1),0) || 
                               round(DBMS_RANDOM.VALUE(1,9),0) || '호';    
                               
            ELSIF temp_num = 4 THEN        
            
                    -- 상세주소 범위 : 1101~1115동 1~25층 ex) 2501호                
                    temp_dong := round(DBMS_RANDOM.VALUE(1101,1115),0) || '동';
                    
                    temp_ho := round(DBMS_RANDOM.VALUE(10,25),0) || 
                               round(DBMS_RANDOM.VALUE(0,1),0) || 
                               round(DBMS_RANDOM.VALUE(1,9),0) || '호';  
                
            ELSIF temp_num = 5 THEN   
            
                    -- 상세주소 범위 : 101~114동 1~23층  ex) 1401호           
                    temp_dong := round(DBMS_RANDOM.VALUE(101,114),0) || '동';
                    
                    temp_ho := round(DBMS_RANDOM.VALUE(10,14),0) || 
                               round(DBMS_RANDOM.VALUE(0,1),0) || 
                               round(DBMS_RANDOM.VALUE(1,9),0) || '호';   
                               
            ELSIF temp_num = 6 THEN    
            
                    -- 상세주소 범위 : 101~123동 1~24층  ex) 1704호        
                    temp_dong := round(DBMS_RANDOM.VALUE(101,123),0) || '동';
                    
                    temp_ho := round(DBMS_RANDOM.VALUE(10,23),0) || 
                               round(DBMS_RANDOM.VALUE(0,1),0) || 
                               round(DBMS_RANDOM.VALUE(1,9),0) || '호';   
                               
            ELSE 
            
                 -- 상세주소 범위 : 101~112동 1~15층 ex) 1406호  
                    temp_dong := round(DBMS_RANDOM.VALUE(101,112),0) || '동';
                    
                    temp_ho := round(DBMS_RANDOM.VALUE(10,15),0) || 
                               round(DBMS_RANDOM.VALUE(0,1),0) || 
                               round(DBMS_RANDOM.VALUE(1,9),0) || '호';      
                               
            END IF;                   
            -- DBMS_OUTPUT.put_line(apt_addresses(temp_num).zip_code);
            -- DBMS_OUTPUT.put_line(apt_addresses(temp_num).road_address);
            -- DBMS_OUTPUT.put_line(apt_addresses(temp_num).jibun_address);
        
            -- 상세주소
            temp_detail_address := temp_dong || ' ' || temp_ho;            
            -- DBMS_OUTPUT.put_line('상세 주소 : ' || temp_detail_address);
            
            -- 주소 현황 업데이트(수정)
            UPDATE member_tbl SET 
            zip = apt_addresses(temp_num).zip_code,
            road_address = apt_addresses(temp_num).road_address,
            jibun_address = apt_addresses(temp_num).jibun_address,
            detail_address= temp_detail_address
            WHERE id = 'ezen' || (1000+i);
        
      END LOOP;  

  COMMIT;         
END;  
/         