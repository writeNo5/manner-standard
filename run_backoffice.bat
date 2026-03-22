@echo off
chcp 65001 >nul
echo ==== 매너의 정석 DB 변환 및 백오피스 시작 ====
echo [1/2] 엑셀에서 추출한 3개의 CSV 데이터를 JSON으로 합칩니다...
python convert_to_json.py
echo.
echo [2/2] 도슨트 다정 백오피스 서버를 실행합니다...
echo 브라우저에서 자동으로 백오피스가 열립니다. (주소: http://localhost:8080)
start http://localhost:8080
python backoffice.py
pause
