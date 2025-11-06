
Attribute VB_Name = "BOM_AllInOne"
Option Explicit

' =========================
' ============ SETUP ======
' =========================

' Run this once in a new .xlsm to create the BOM sheets, headers, inputs, button, and totals.
Sub Setup_BOM_All()
    Ensure_EquipmentList_Sheet
    Ensure_BOM_Builder_Sheet
    Ensure_Customer_BOM_Sheet
    Setup_Input_Cells  ' E5: Part (list, allowed to type), F5: Qty (>=1), G5: Location (text)
    Add_AddToBOM_Button
    Lock_AddToBOM_Button
    MsgBox "BOM Builder is ready. Use E5 Part, F5 Qty, G5 Location, then click 'Add to BOM'.", vbInformation, "Setup Complete"
End Sub

' Auto-runs on open to re-apply the flexible dropdown and rewire the button if needed
Sub Auto_Open()
    On Error Resume Next
    Setup_Input_Cells
    Add_AddToBOM_Button
    Lock_AddToBOM_Button
End Sub

' Ensure an Equipment List sheet exists with the 3 core columns.
Private Sub Ensure_EquipmentList_Sheet()
    Dim ws As Worksheet
    On Error Resume Next
    Set ws = ThisWorkbook.Sheets("Equipment List")
    On Error GoTo 0
    If ws Is Nothing Then
        Set ws = ThisWorkbook.Sheets.Add(After:=Sheets(Sheets.Count))
        ws.Name = "Equipment List"
        ws.Range("A1").Value = "Part Number"
        ws.Range("B1").Value = "Description"
        ws.Range("C1").Value = "Price"
    End If
    Ensure_PartNumbers_Name
End Sub

' Build or reset the BOM Builder sheet
Private Sub Ensure_BOM_Builder_Sheet()
    Dim ws As Worksheet, r As Long, c As Long
    On Error Resume Next
    Set ws = ThisWorkbook.Sheets("BOM Builder")
    On Error GoTo 0
    If ws Is Nothing Then
        Set ws = ThisWorkbook.Sheets.Add(Before:=Sheets(1))
        ws.Name = "BOM Builder"
    End If

    ' Headers (row 9). NOTE: A9 text set to "Description" per user preference.
    ws.Range("A9").Value = "Description"
    ws.Range("B9").Value = "Description"
    ws.Range("C9").Value = "Location"
    ws.Range("D9").Value = "Price"
    ws.Range("E9").Value = "Quantity"
    ws.Range("F9").Value = "Line Total"

    ' Column widths
    ws.Columns("A").ColumnWidth = 18
    ws.Columns("B").ColumnWidth = 38
    ws.Columns("C").ColumnWidth = 18
    ws.Columns("D").ColumnWidth = 12
    ws.Columns("E").ColumnWidth = 10
    ws.Columns("F").ColumnWidth = 14

    ' Style headers (simple, compatible)
    With ws.Range("A9:F9")
        .Font.Bold = True
        .HorizontalAlignment = 3 ' center
        .VerticalAlignment = 2   ' center
        .Interior.Color = RGB(48, 84, 150)
        .Font.Color = RGB(255, 255, 255)
    End With

    ' Borders and formats for working area rows 10:201
    For r = 10 To 201
        For c = 1 To 6
            With ws.Cells(r, c).Borders
                .LineStyle = 1 ' xlContinuous
                .Weight = 2    ' xlThin
            End With
            If c = 1 Or c = 3 Or c = 5 Then
                ws.Cells(r, c).HorizontalAlignment = 3 ' center
            ElseIf c = 4 Or c = 6 Then
                ws.Cells(r, c).HorizontalAlignment = -4152 ' right
            End If
        Next c
        ws.Cells(r, 4).NumberFormat = "_-[$$-en-AU]* #,##0.00_-;_-[$$-en-AU]* -#,##0.00_-;_-[$$-en-AU]* ""-""??_-;_-@_-"
        ws.Cells(r, 6).NumberFormat = "_-[$$-en-AU]* #,##0.00_-;_-[$$-en-AU]* -#,##0.00_-;_-[$$-en-AU]* ""-""??_-;_-@_-"
    Next r

    ' Total row
    ws.Range("E202").Value = "Total"
    ws.Range("E202").Font.Bold = True
    ws.Range("F202").Formula = "=SUM(F10:F201)"
    ws.Range("F202").Font.Bold = True
    ws.Range("F202").NumberFormat = "_-[$$-en-AU]* #,##0.00_-;_-[$$-en-AU]* -#,##0.00_-;_-[$$-en-AU]* ""-""??_-;_-@_-"

    ' Labels above inputs
    ws.Range("E4").Value = "Part"
    ws.Range("F4").Value = "Qty"
    ws.Range("G4").Value = "Location"
    ws.Range("E4:G4").Font.Bold = True
End Sub

' Build or reset the Customer BOM sheet
Private Sub Ensure_Customer_BOM_Sheet()
    Dim ws As Worksheet, r As Long, c As Long
    On Error Resume Next
    Set ws = ThisWorkbook.Sheets("Customer BOM")
    On Error GoTo 0
    If ws Is Nothing Then
        Set ws = ThisWorkbook.Sheets.Add(After:=Sheets(Sheets.Count))
        ws.Name = "Customer BOM"
    End If

    ' Header row 12
    ws.Range("A12").Value = "Part Number"
    ws.Range("B12").Value = "Description"
    ws.Range("C12").Value = "Location"
    ws.Range("D12").Value = "Price"
    ws.Range("E12").Value = "Quantity"
    ws.Range("F12").Value = "Line Total"

    ' Column widths
    ws.Columns("A").ColumnWidth = 18
    ws.Columns("B").ColumnWidth = 38
    ws.Columns("C").ColumnWidth = 18
    ws.Columns("D").ColumnWidth = 12
    ws.Columns("E").ColumnWidth = 10
    ws.Columns("F").ColumnWidth = 14

    ' Header style
    With ws.Range("A12:F12")
        .Font.Bold = True
        .HorizontalAlignment = 3 ' center
        .VerticalAlignment = 2   ' center
        .Interior.Color = RGB(48, 84, 150)
        .Font.Color = RGB(255, 255, 255)
    End With

    ' Borders and formats rows 13:162
    For r = 13 To 162
        For c = 1 To 6
            With ws.Cells(r, c).Borders
                .LineStyle = 1
                .Weight = 2
            End With
            If c = 1 Or c = 3 Or c = 5 Then
                ws.Cells(r, c).HorizontalAlignment = 3 ' center
            ElseIf c = 4 Or c = 6 Then
                ws.Cells(r, c).HorizontalAlignment = -4152 ' right
            End If
        Next c
        ws.Cells(r, 4).NumberFormat = "_-[$$-en-AU]* #,##0.00_-;_-[$$-en-AU]* -#,##0.00_-;_-[$$-en-AU]* ""-""??_-;_-@_-"
        ws.Cells(r, 6).NumberFormat = "_-[$$-en-AU]* #,##0.00_-;_-[$$-en-AU]* -#,##0.00_-;_-[$$-en-AU]* ""-""??_-;_-@_-"
    Next r

    ' Total row
    ws.Range("E165").Value = "Total"
    ws.Range("E165").Font.Bold = True
    ws.Range("F165").Formula = "=SUM(F13:F162)"
    ws.Range("F165").Font.Bold = True
    ws.Range("F165").NumberFormat = "_-[$$-en-AU]* #,##0.00_-;_-[$$-en-AU]* -#,##0.00_-;_-[$$-en-AU]* ""-""??_-;_-@_-"
End Sub

' =========================
' =========== INPUTS ======
' =========================

' E5 = Part (dropdown to PartNumbers but allow custom), F5 = Qty (>=1), G5 = Location (text)
Sub Setup_Input_Cells()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("BOM Builder")
    Ensure_PartNumbers_Name

    ' Part number dropdown (List but ShowError False so custom entries allowed)
    With ws.Range("E5")
        On Error Resume Next
        .Validation.Delete
        On Error GoTo 0
        .Validation.Add Type:=3, AlertStyle:=1, Formula1:="=PartNumbers"
        .Validation.IgnoreBlank = True
        .Validation.InCellDropdown = True
        .Validation.ShowError = False
        .Validation.ShowInput = True
        .Validation.InputTitle = "Part Number"
        .Validation.InputMessage = "Pick from list or type your own."
    End With

    ' Qty validation (whole >= 1)
    With ws.Range("F5")
        If .Value = "" Then .Value = 1
        .NumberFormat = "0"
        .HorizontalAlignment = 3 ' center
        On Error Resume Next
        .Validation.Delete
        On Error GoTo 0
        .Validation.Add Type:=1, AlertStyle:=1, Operator:=7, Formula1:="1"
        .Validation.IgnoreBlank = True
        .Validation.InCellDropdown = True
        .Validation.InputTitle = "Quantity"
        .Validation.InputMessage = "Enter a whole number (1 or more)."
        .Validation.ErrorTitle = "Invalid Quantity"
        .Validation.ErrorMessage = "Please enter a whole number of 1 or more."
        .Validation.ShowInput = True
        .Validation.ShowError = True
    End With

    ' Location text
    With ws.Range("G5")
        .NumberFormat = "@"
        On Error Resume Next
        .Validation.Delete
        On Error GoTo 0
    End With
End Sub

' Build a dynamic named range PartNumbers -> Equipment List!A2:A(last)
Private Sub Ensure_PartNumbers_Name()
    Dim nm As Name, exists As Boolean
    Dim refers As String
    refers = "=OFFSET('Equipment List'!$A$2,0,0,COUNTA('Equipment List'!$A:$A)-1,1)"
    exists = False
    For Each nm In ThisWorkbook.Names
        If LCase$(nm.Name) = "partnumbers" Then
            exists = True
            On Error Resume Next
            nm.RefersTo = refers
            On Error GoTo 0
            Exit For
        End If
    Next nm
    If Not exists Then ThisWorkbook.Names.Add Name:="PartNumbers", RefersTo:=refers
End Sub

' =========================
' ====== MAIN ACTIONS =====
' =========================

' Add to BOM: uses E5 (Part), F5 (Qty), G5 (Location). If part not found, prompt for Description & Price.
Sub AddToBOM()
    Dim wsList As Worksheet, wsBOM As Worksheet
    Dim partNumber As String, locText As String
    Dim qtyVal As Variant, qty As Long
    Dim nextRow As Long
    Dim findCell As Range
    Dim descText As String, priceText As String, price As Double

    Set wsList = ThisWorkbook.Sheets("Equipment List")
    Set wsBOM = ThisWorkbook.Sheets("BOM Builder")

    partNumber = Trim(wsBOM.Range("E5").Value)
    qtyVal = wsBOM.Range("F5").Value
    locText = Trim(wsBOM.Range("G5").Value)

    If partNumber = "" Then
        MsgBox "Please select or type a Part Number in E5.", vbExclamation, "Add to BOM"
        Exit Sub
    End If

    If IsNumeric(qtyVal) Then
        qty = CLng(qtyVal)
        If qty <= 0 Then qty = 1
    Else
        qty = 1
    End If

    Set findCell = wsList.Range("A:A").Find(What:=partNumber, LookAt:=xlWhole, MatchCase:=False)

    If wsBOM.Cells(10, 1).Value = "" Then
        nextRow = 10
    Else
        nextRow = wsBOM.Cells(wsBOM.Rows.Count, "A").End(xlUp).Row + 1
    End If

    If findCell Is Nothing Then
        ' Custom part
        descText = InputBox("Custom Part '" & partNumber & "':" & vbCrLf & _
                            "Enter a Description", "Custom Description")
        If descText = vbNullString Then Exit Sub

        priceText = InputBox("Custom Part '" & partNumber & "':" & vbCrLf & _
                             "Enter a Price (numbers only)", "Custom Price", "0")
        If priceText = vbNullString Then Exit Sub
        If IsNumeric(priceText) Then price = CDbl(priceText) Else price = 0

        ' Write: A Part Number, B Description, C Location, D Price, E Qty, F Line Total
        wsBOM.Cells(nextRow, 1).Value = partNumber
        wsBOM.Cells(nextRow, 2).Value = descText
        wsBOM.Cells(nextRow, 3).Value = locText
        wsBOM.Cells(nextRow, 4).Value = price
        wsBOM.Cells(nextRow, 5).Value = qty
        wsBOM.Cells(nextRow, 6).Formula = "=D" & nextRow & "*E" & nextRow
    Else
        ' From list
        wsBOM.Cells(nextRow, 1).Value = findCell.Value
        wsBOM.Cells(nextRow, 2).Value = findCell.Offset(0, 1).Value
        wsBOM.Cells(nextRow, 3).Value = locText
        wsBOM.Cells(nextRow, 4).Value = findCell.Offset(0, 2).Value
        wsBOM.Cells(nextRow, 5).Value = qty
        wsBOM.Cells(nextRow, 6).Formula = "=D" & nextRow & "*E" & nextRow
    End If

    wsBOM.Range("E5").ClearContents
End Sub

' Copy BOM Builder A:F into Customer BOM (values)
Sub PrepareBOM()
    Dim wsB As Worksheet, wsC As Worksheet
    Dim lastRow As Long, tgt As Long, r As Long

    Set wsB = ThisWorkbook.Sheets("BOM Builder")
    Set wsC = ThisWorkbook.Sheets("Customer BOM")

    lastRow = wsB.Cells(wsB.Rows.Count, "A").End(xlUp).Row
    If lastRow < 10 Then
        MsgBox "No items found in BOM Builder.", vbExclamation, "Prepare BOM"
        Exit Sub
    End If

    wsC.Range("A13:F162").ClearContents

    tgt = 13
    For r = 10 To lastRow
        If wsB.Cells(r, 1).Value <> "" Then
            wsC.Cells(tgt, 1).Value = wsB.Cells(r, 1).Value
            wsC.Cells(tgt, 2).Value = wsB.Cells(r, 2).Value
            wsC.Cells(tgt, 3).Value = wsB.Cells(r, 3).Value
            wsC.Cells(tgt, 4).Value = wsB.Cells(r, 4).Value
            wsC.Cells(tgt, 5).Value = wsB.Cells(r, 5).Value
            wsC.Cells(tgt, 6).Value = wsB.Cells(r, 6).Value
            tgt = tgt + 1
        End If
    Next r

    MsgBox "Customer BOM updated.", vbInformation, "Prepare BOM"
End Sub

' Export Customer BOM to a new .xlsx
Sub ExportBOM()
    Dim ws As Worksheet, newWb As Workbook
    Dim savePath As Variant

    Set ws = ThisWorkbook.Sheets("Customer BOM")

    If Application.WorksheetFunction.CountA(ws.Range("A13:F162")) = 0 Then
        If MsgBox("Customer BOM looks empty. Export anyway?", vbQuestion + vbYesNo, "Export BOM") = vbNo Then Exit Sub
    End If

    ws.Copy
    Set newWb = ActiveWorkbook

    savePath = Application.GetSaveAsFilename(InitialFileName:="Customer_BOM.xlsx", _
                                             FileFilter:="Excel Files (*.xlsx), *.xlsx")
    If savePath <> False Then
        Application.DisplayAlerts = False
        newWb.SaveAs Filename:=savePath, FileFormat:=xlOpenXMLWorkbook
        Application.DisplayAlerts = True
        MsgBox "Saved to: " & CStr(savePath), vbInformation, "Export BOM"
    End If

    newWb.Close SaveChanges:=False
End Sub

' Clear working BOM and snapshot
Sub NewBOM()
    Dim wsB As Worksheet, wsC As Worksheet
    Set wsB = ThisWorkbook.Sheets("BOM Builder")
    Set wsC = ThisWorkbook.Sheets("Customer BOM")

    wsB.Range("A10:F201").ClearContents
    wsB.Range("E5").ClearContents ' keep qty and location for convenience
    wsC.Range("A13:F162").ClearContents
    MsgBox "New BOM started.", vbInformation, "New BOM"
End Sub

' =========================
' ====== UI HELPERS =======
' =========================

' Add a Form Control button that calls AddToBOM
Sub Add_AddToBOM_Button()
    Dim ws As Worksheet
    Dim btn As Button
    Set ws = ThisWorkbook.Sheets("BOM Builder")

    On Error Resume Next
    ws.Buttons("btnAddToBOM").Delete
    On Error GoTo 0

    Set btn = ws.Buttons.Add(520, 86, 140, 24)
    btn.Caption = "Add to BOM"
    btn.Name = "btnAddToBOM"
    btn.OnAction = "AddToBOM"
End Sub

' Lock the Add to BOM button so it won't move with cells
Sub Lock_AddToBOM_Button()
    Dim ws As Worksheet
    Dim sh As Shape

    Set ws = ThisWorkbook.Sheets("BOM Builder")
    On Error Resume Next
    Set sh = ws.Shapes("btnAddToBOM")
    On Error GoTo 0
    If sh Is Nothing Then Exit Sub

    sh.Placement = 3 ' xlFreeFloating
    sh.Locked = True

    On Error Resume Next
    ws.Protect DrawingObjects:=True, Contents:=False, Scenarios:=False, UserInterfaceOnly:=True
    On Error GoTo 0
End Sub

' Unlock to reposition
Sub Unlock_AddToBOM_Button()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("BOM Builder")
    On Error Resume Next
    ws.Unprotect
    On Error GoTo 0
    MsgBox "You can move the button now. Run Lock_AddToBOM_Button when finished.", vbInformation, "Unlocked"
End Sub

' Optional: insert a logo image into Customer BOM (you pick the file)
Sub Insert_Logo_Into_CustomerBOM()
    Dim ws As Worksheet
    Dim f As Variant
    Set ws = ThisWorkbook.Sheets("Customer BOM")

    f = Application.GetOpenFilename("Image Files (*.png;*.jpg;*.jpeg),*.png;*.jpg;*.jpeg")
    If f = False Then Exit Sub

    ws.Pictures.Insert(f).Select
    With Selection.ShapeRange
        .LockAspectRatio = msoTrue
        .Width = 240
        .Top = ws.Range("A1").Top + 5
        .Left = ws.Range("A1").Left + 5
    End With
End Sub
