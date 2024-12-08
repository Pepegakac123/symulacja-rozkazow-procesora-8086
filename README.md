# Symulator rozkazów procesora Intel 8086

## Spis treści
- [Architektura procesora 8086](#architektura-procesora-8086)
- [Rejestry](#rejestry)
  - [Rejestry ogólnego przeznaczenia](#rejestry-ogólnego-przeznaczenia)
  - [Rejestry wskaźników i indeksów](#rejestry-wskaźników-i-indeksów)
- [Funkcjonalności symulatora](#funkcjonalności-symulatora)
- [Operacje na rejestrach](#operacje-na-rejestrach)
- [Tryby adresowania](#tryby-adresowania)
- [Operacje na pamięci](#operacje-na-pamięci)
- [Operacje na stosie](#operacje-na-stosie)


## Architektura procesora 8086
Procesor 8086 to jednostka 16-bitowa, która może przetwarzać dane o długości 16 bitów (dwa bajty) w jednej operacji. Wykorzystuje architekturę CISC (Complex Instruction Set Computing), co oznacza, że posiada rozbudowany zestaw instrukcji pozwalających na wykonywanie złożonych operacji.

## Rejestry

### Rejestry ogólnego przeznaczenia
- **AX (Accumulator)**: Główny rejestr akumulatora, używany do operacji arytmetycznych i logicznych
- **BX (Base Register)**: Rejestr bazowy, często używany w adresowaniu pamięci
- **CX (Counter)**: Rejestr licznika, używany w operacjach iteracyjnych
- **DX (Data Register)**: Rejestr danych, pomocniczy w operacjach arytmetycznych

### Rejestry wskaźników i indeksów
- **SI (Source Index)**: Rejestr indeksu źródłowego
- **DI (Destination Index)**: Rejestr indeksu docelowego
- **BP (Base Pointer)**: Wskaźnik bazowy, używany w operacjach stosowych
- **SP (Stack Pointer)**: Wskaźnik stosu, wskazuje na szczyt stosu

## Funkcjonalności symulatora

### 1. Panel rejestrów
- Wyświetlanie i modyfikacja wartości rejestrów
- Operacje MOV i XCHG między rejestrami
- Generowanie losowych wartości
- Resetowanie wartości

![alt text](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/)

### 2. Operacje pamięci
- Wybór trybu adresowania
- Operacje MOV i XCHG między rejestrami a pamięcią
- Podgląd zawartości pamięci
- Obliczanie efektywnego adresu

[Zdjęcie operacji pamięci]

### 3. Operacje na stosie
- Operacje PUSH i POP
- Wyświetlanie wskaźnika stosu (SP)
- Podgląd zawartości stosu

[Zdjęcie operacji na stosie]

### 4. Historia operacji
- Rejestrowanie wszystkich wykonanych operacji
- Wyświetlanie w formacie asemblera
- Możliwość wyczyszczenia historii

[Zdjęcie historii operacji]

## Operacje na rejestrach

### MOV (przeniesienie)
Kopiuje wartość z jednego rejestru do drugiego:
```assembly
MOV AX, BX  ; Kopiuje wartość z BX do AX
```

### XCHG (wymiana)
Zamienia wartości między dwoma rejestrami:
```assembly
XCHG AX, BX  ; Zamienia wartości między AX i BX
```

## Tryby adresowania
W procesorze 8086 występują różne tryby adresowania, które określają sposób dostępu do danych w pamięci:

### 1. Tryb indeksowy
Używa rejestrów SI lub DI plus przesunięcie (DISP):
```assembly
; Przykład: [SI + 1234h]
MOV AX, [SI + 1234h]  ; Pobiera wartość z pamięci spod adresu SI + 1234h do AX
```

### 2. Tryb bazowy
Wykorzystuje rejestry BX lub BP plus przesunięcie (DISP):
```assembly
; Przykład: [BX + 5678h]
MOV AX, [BX + 5678h]  ; Pobiera wartość z pamięci spod adresu BX + 5678h do AX
```

### 3. Tryb indeksowo-bazowy
Łączy rejestr indeksowy (SI/DI) z rejestrem bazowym (BX/BP) plus przesunięcie (DISP):
```assembly
; Przykład: [SI + BX + 1000h]
MOV AX, [SI + BX + 1000h]  ; Pobiera wartość z adresu SI + BX + 1000h do AX
```
[Zdjęcie operacji na rejestrach]

## Operacje na pamięci
Symulator umożliwia wykonywanie operacji przenoszenia (MOV) i wymiany (XCHG) między rejestrami a pamięcią z wykorzystaniem różnych trybów adresowania.

### Przykłady:
```assembly
MOV [SI + 1234h], AX  ; Zapisuje wartość z AX do pamięci
MOV BX, [DI + 5678h]  ; Pobiera wartość z pamięci do BX
XCHG AX, [BX + 1000h] ; Wymienia wartość między AX a pamięcią
```

[Zdjęcie operacji na pamięci]

## Operacje na stosie
Stos to specjalna struktura danych typu LIFO (Last In, First Out), gdzie operacje wykonywane są na zasadzie "ostatni na wejściu, pierwszy na wyjściu".

### PUSH (włożenie na stos)
```assembly
PUSH AX  ; Odkłada wartość z AX na stos
```
- Zmniejsza SP o 2
- Zapisuje wartość na szczycie stosu

### POP (zdjęcie ze stosu)
```assembly
POP BX  ; Pobiera wartość ze stosu do BX
```
- Pobiera wartość ze szczytu stosu
- Zwiększa SP o 2

[Zdjęcie operacji na stosie]


