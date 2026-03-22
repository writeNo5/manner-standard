import zipfile
import xml.etree.ElementTree as ET
import csv
import sys
import os

def excel_to_csv(excel_path):
    try:
        with zipfile.ZipFile(excel_path, 'r') as z:
            # Get shared strings
            strings_dict = {}
            if 'xl/sharedStrings.xml' in z.namelist():
                with z.open('xl/sharedStrings.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    for i, si in enumerate(root.findall('ns:si', ns)):
                        texts = "".join([t.text for t in si.iter(f'{{{ns["ns"]}}}t')] )
                        strings_dict[i] = texts
            
            # Extract sheets
            for sheet_id in range(1, 4):
                sheet_xml = f'xl/worksheets/sheet{sheet_id}.xml'
                if sheet_xml in z.namelist():
                    csv_path = f'C:\\Users\\SW_PM\\projects\\Manner Standard\\temp_excel_sheet{sheet_id}.csv'
                    with z.open(sheet_xml) as f:
                        tree = ET.parse(f)
                        root = tree.getroot()
                        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                        with open(csv_path, 'w', encoding='utf-8', newline='') as out_f:
                            writer = csv.writer(out_f)
                            for row in root.find('ns:sheetData', ns).findall('ns:row', ns):
                                csv_row = []
                                for c in row.findall('ns:c', ns):
                                    v = c.find('ns:v', ns)
                                    if v is not None:
                                        t = c.get('t', '')
                                        if t == 's':
                                            csv_row.append(strings_dict.get(int(v.text), ""))
                                        else:
                                            csv_row.append(v.text)
                                    else:
                                        csv_row.append("")
                                writer.writerow(csv_row)
                    print(f"Success: {sheet_xml} -> {csv_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    excel_to_csv(sys.argv[1])
