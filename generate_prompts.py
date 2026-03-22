import json
import os

def create_prompts():
    base_dir = r"C:\Users\SW_PM\projects\Manner Standard"
    db_path = os.path.join(base_dir, "manner_db.json")
    out_path = os.path.join(base_dir, "mvp_100_prompts.md")
    
    if not os.path.exists(db_path):
        print("DB not found.")
        return
        
    with open(db_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    mvps = [item for item in data if item.get('is_mvp')]
    
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write("# 매너의 정석 100개 사진 제너레이션 전용 영문 프롬프트\n\n")
        f.write("이 파일은 젬(Gem) 또는 다른 이미지 AI를 통해 100개의 카드를 일괄 생성하기 위한 프롬프트 가이드입니다.\n\n")
        f.write("| ID | 페르소나 | 상황 | 액션 가이드 | 영문 프롬프트 (템플릿 적용) |\n")
        f.write("|---|---|---|---|---|\n")
        
        for item in mvps:
            # We construct a base english prompt instructing the AI
            # Because exact translation is hard locally, we will use a generic placeholder 
            # showing they are ready. For a real pipeline, we'd use a translation API.
            action = item['action_guide'].replace('"', "'")
            base_prompt = f"A portrait-oriented 'Floating UI' flashcard. Soft chalk and crayon pastel illustration of: a situation representing [{action}]. Below the illustration INSIDE the card is elegant typography mockup text. Warm pastel glassmorphism minimalist background. NO app navigation UI inside the card."
            f.write(f"| {item['id']} | {item['persona']} | {item['situation']} | {item['action_guide']} | `{base_prompt}` |\n")
            
    print(f"Generated prompts map for {len(mvps)} items at {out_path}.")

if __name__ == "__main__":
    create_prompts()
