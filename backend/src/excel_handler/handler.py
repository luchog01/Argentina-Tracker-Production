import pandas as pd
import os
import sys

files_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "files")

if not os.path.exists(files_folder):
    os.makedirs(os.path.join(files_folder))

def get_excel(ticker: int) -> str:
    file_path = os.path.join(files_folder,f"{ticker}.xlsx")
    return file_path

def update_excel(funds_data: dict, fecha: str) -> None:

    try:
        for key in funds_data.keys():
            file_path = os.path.join(files_folder,f"{key}.xlsx")
            try:
                old_df = pd.read_excel(file_path, index_col=0)
            except FileNotFoundError:
                old_df = pd.DataFrame()
            update_df = funds_data[key]
            update_df = pd.DataFrame(update_df)
            update_df.drop("price", axis=0, inplace=True)
            update_df = update_df.transpose()
            update_df.rename(columns={"qty": fecha}, inplace=True)
            try:
                if fecha in list(old_df.columns):
                    old_df.drop(fecha, axis=1, inplace=True) # Si la fecha ya existe, la borra
                
                update_df = old_df.join(update_df, how="outer", sort=True) # Une los dataframes
            
                update_df.to_excel(file_path)
                print(f"[OK] [file_handler.py] [{key}] Excel saved")
            except ValueError:
                print(f"[ERROR] [file_handler.py] [{key}] ValueError when joining dataframes")
            except Exception as e:
                print(f"[ERROR] [file_handler.py] [{key}] {e}")
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        print("[ERROR] update_excel: ",e, exc_tb.tb_lineno)



# with open (os.path.join(files_folder,"borrar.txt"), "r") as f:
#         data = f.read()
#         data = json.loads(data)

# update_excel(data, "06-01-2023")