@ECHO OFF
REM Windows Updateの過去のデータを消去する
REM 
REM Windows Update error "0x80070002" or "0x80070003"
REM https://support.microsoft.com/en-us/kb/910336

REM Windows Updateサービスを停止
NET STOP wuauserv

REM DataStoreディレクトリ以下のファイルも削除
SET TARGET=%WINDIR%\SoftwareDistribution\DataStore
DEL /Q /S "%TARGET%\*"
FOR /D %%1 IN ("%TARGET%\*") DO RMDIR /Q /S "%%1"

REM Downloadディレクトリ以下のファイルも削除
SET TARGET=%WINDIR%\SoftwareDistribution\Download
DEL /Q /S "%TARGET%\*"
FOR /D %%1 IN ("%TARGET%\*") DO RMDIR /Q /S "%%1"

REM Windows Updateサービスを再開
NET START wuauserv
