import csv
import json
import os
from datetime import datetime, timedelta

def convert_to_json():
    # File paths
    base_dir = r"C:\Users\SW_PM\projects\Manner Standard"
    sheets = [
        ("student", "temp_excel_sheet1.csv"),
        ("worker", "temp_excel_sheet2.csv"),
        ("senior", "temp_excel_sheet3.csv")
    ]
    
    # MVP Target Themes (Digital & Public Space mostly)
    target_themes_student = ["단톡방의 품격 (디지털 및 SNS 매너)", "공유 공간의 마법 (학교 시설 및 공용 공간)"]
    target_themes_worker = ["디지털 오피스의 예의 (메일 및 메신저)", "함께 쓰는 공간의 미학 (탕비실 및 공용 시설)"]
    target_themes_senior = ["디지털 실버의 예의 (스마트폰 및 키오스크)", "품격 있는 발걸음 (대중교통 및 공공시설)"]
    
    # Target MVP counts
    mvp_targets = {"student": 33, "worker": 34, "senior": 33}
    mvp_counters = {"student": 0, "worker": 0, "senior": 0}
    
    start_date = datetime(2026, 3, 21)
    
    db = []
    item_id = 1
    
    for persona, file_name in sheets:
        file_path = os.path.join(base_dir, file_name)
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            # Skip empty lines and headers
            for obj in reader:
                if len(obj) < 6: continue
                # Typically row is: _, Theme, 상황, 매너 명칭, 액션 가이드, 따뜻한 한 줄, 플래시카드, _
                # We skip headers
                if obj[1] == "Theme" or not obj[1]: continue
                
                theme = obj[1].strip()
                situation = obj[2].strip()
                name = obj[3].strip()
                action_guide = obj[4].strip()
                warm_line = obj[5].strip()
                
                # Determine if it should be an MVP item
                is_mvp = False
                publish_date = ""
                
                if mvp_counters[persona] < mvp_targets[persona]:
                    # Check if it matches target themes
                    if persona == "student" and theme in target_themes_student:
                        is_mvp = True
                    elif persona == "worker" and theme in target_themes_worker:
                        is_mvp = True
                    elif persona == "senior" and theme in target_themes_senior:
                        is_mvp = True
                        
                    # If we still need more to hit target, just take next available
                    # (In our case, each theme has 30 items, so 2 themes = 60 items. We easily hit 33/34)
                    
                    if is_mvp:
                        mvp_counters[persona] += 1
                        # 2 items per day, we calculate day offset (ignoring persona to interleave)
                        day_offset = (item_id - 1) // 2 
                        pub_date = start_date + timedelta(days=day_offset)
                        publish_date = pub_date.strftime("%Y-%m-%d")

                item = {
                    "id": item_id,
                    "persona": persona,
                    "theme": theme,
                    "situation": situation,
                    "name": name,
                    "action_guide": action_guide,
                    "warm_line": warm_line,
                    "is_mvp": is_mvp,
                    "publish_date": publish_date
                }
                
                db.append(item)
                item_id += 1
                
    # Save to JSON
    out_path = os.path.join(base_dir, "manner_db.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=4)
        
    print(f"Successfully converted 540 items to JSON (Total: {len(db)}).")
    print(f"MVP assigned: {mvp_counters} (Total: {sum(mvp_counters.values())} items).")

if __name__ == "__main__":
    convert_to_json()
