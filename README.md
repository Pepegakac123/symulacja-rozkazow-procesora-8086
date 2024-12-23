# Symulator rozkazów procesora Intel 8086
![Obraz Symulatora](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/main-simulator.png)
## Spis treści
- [Architektura procesora 8086](#architektura-procesora-8086)
- [Rejestry](#rejestry)
  - [Rejestry ogólnego przeznaczenia](#rejestry-ogólnego-przeznaczenia)
  - [Rejestry wskaźników i indeksów](#rejestry-wskaźników-i-indeksów)
- [Funkcjonalności symulatora](#funkcjonalności-symulatora)
  - [Panel rejestrów](#1-panel-rejestrów)
  - [Operacje pamięci](#2-operacje-pamięci)
  - [Operacje na stosie](#3-operacje-na-stosie)
  - [Historia operacji](#4-historia-operacji)
- [Operacje na rejestrach](#operacje-zapisywania-z-rejestru-do-pamięci)
  - [MOV - przeniesienie](#mov-przeniesienie)
  - [XCHG - wymiana](#xchg-wymiana)
- [Tryby adresowania pamięci](#tryby-adresowania)
  - [Tryb indeksowy](#1-tryb-indeksowy)
  - [Tryb bazowy](#2-tryb-bazowy)
  - [Tryb indeksowo-bazowy](#3-tryb-indeksowo-bazowy)
- [Operacje pamięciowe](#operacje-zapisywania-z-pamięci-do-rejestru)
  - [Zapisywanie do pamięci](#operacje-zapisywania-z-rejestru-do-pamięci)
  - [Odczyt z pamięci](#operacje-zapisywania-z-pamięci-do-rejestru)
  - [Wymiana z pamięcią](#operacje-zamiany-wartości-pomiędzy-pamięcią-a-rejestrem)
- [Operacje stosowe](#operacje-na-stosie)
  - [Wskaźnik stosu SP](#operacje-na-stosie)
  - [PUSH - odkładanie na stos](#push-włożenie-na-stos)
  - [POP - zdejmowanie ze stosu](#pop-zdjęcie-ze-stosu)



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
- **DISP (Displacement)/offset**: Przesunięcie, wartość określająca offset względem adresu bazowego lub indeksowego, używana do precyzyjnego adresowania pamięci

## Funkcjonalności symulatora

### 1. Panel rejestrów
- Wyświetlanie i modyfikacja wartości rejestrów
- Operacje MOV i XCHG między rejestrami
- Generowanie losowych wartości
- Resetowanie wartości

![Panel Rejestrów](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/main-registers.png)

### 2. Operacje pamięci
- Wybór trybu adresowania
- Operacje MOV i XCHG między rejestrami a pamięcią
- Podgląd zawartości pamięci
- Obliczanie efektywnego adresu

![Operacje pamięci](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/address-registers.png)

### 3. Operacje na stosie
- Operacje PUSH i POP
- Wyświetlanie wskaźnika stosu (SP)
- Podgląd zawartości stosu

![Operacje na stosie](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/stack.png)

### 4. Historia operacji
- Rejestrowanie wszystkich wykonanych operacji
- Wyświetlanie w formacie asemblera
- Możliwość wyczyszczenia historii

![Historia operacji](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/operation-history.png)

## Operacje zapisywania z rejestru do pamięci

### MOV (przeniesienie)
Kopiuje wartość z jednego rejestru do drugiego:
```assembly
MOV AX, BX  ; Kopiuje wartość z BX do AX
```
#### Przed Operacją
![Przed Operacją MOV](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images//mov/before.png)

#### Po Operacji
![Po Operacji MOV](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/mov/after.png)
### XCHG (wymiana)
Zamienia wartości między dwoma rejestrami:
```assembly
XCHG CX, DX  ; Zamienia wartości między CX i DX
```
#### Przed Operacją
![Przed Operacją XCHG](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/xchg/before.png)

#### Po Operacji
![Po Operacji XCHG](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/xchg/after.png)
## Tryby adresowania
W procesorze 8086 występują różne tryby adresowania, które określają sposób dostępu do danych w pamięci:

### 1. Tryb indeksowy
Używa rejestrów SI lub DI plus przesunięcie (DISP):
```assembly
; Przykład: [SI + DISP]
MOV [SI + DISP], AX  ; Pobiera wartość do pamięci spod adresu SI + DISP i zapisuje pod tym adresem wartość rejestru AX
```
#### Po Operacji
![Po Operacji ](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/indeksowy/to-memory.png)

### 2. Tryb bazowy
Wykorzystuje rejestry BX lub BP plus przesunięcie (DISP):
```assembly
; Przykład: [BX + DISP]
MOV [BX + DISP], CX  ; Pobiera wartość do pamięci spod adresu BX + DISP i zapisuje pod tym adresem wartość rejestru CX
```
#### Po Operacji
![Po Operacji ](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/bazowy/to-memory.png)

### 3. Tryb indeksowo-bazowy
Łączy rejestr indeksowy (SI/DI) z rejestrem bazowym (BX/BP) plus przesunięcie (DISP):
```assembly
; Przykład: [SI + BX + DISP]
MOV [SI + BX + DISP], DX  ; Pobiera wartość do pamięci spod adresu SI + BX + DISP i zapisuje pod tym adresem wartość rejestru DX
```
#### Po Operacji
![Po Operacji ](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/indeksowy-bazowy/to-memory.png)

## Operacje zapisywania z pamięci do rejestru

### Przypisanie wartości rejestru z pamięci na przykładzie trybu indeksowo-bazowego
Przykład: [SI + BX + DISP]
MOV AX, [SI + BX + DISP]  ; Pobiera wartość z pamięci spod adresu SI + BX + DISP i przypisuje znajdującą się pod tym adresem wartość
#### Po Operacji
![Po Operacji ](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/indeksowy-bazowy/from-memory.png)```
## Operacje zamiany wartości pomiędzy pamięcią a rejestrem

```assembly
Przykład: XCHG BX, [SI + DISP] ; Wymienia wartość między BX a wartością zapisana w pamięci pod danym adresem
```
#### Po Operacji
![Po Operacji ](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/indeksowy/xchg.png)

## Operacje na stosie
Stos to specjalna struktura danych typu LIFO (Last In, First Out), gdzie operacje wykonywane są na zasadzie "ostatni na wejściu, pierwszy na wyjściu".

**SP (Stack Pointer)** - wskaźnik stosu pokazujący aktualną pozycję na szczycie stosu. Wartość 0 oznacza, że następna operacja PUSH zapisze dane pod tym adresem. SP zwiększa się o 2 przy każdej operacji POP i zmniejsza o 2 przy PUSH (każda wartość na stosie zajmuje 2 bajty).

### PUSH (włożenie na stos)
```assembly
PUSH AX  ; Odkłada wartość z AX na stos
PUSH CX ; Odkłada wartość z CX na stos
```
- Zmniejsza SP o 2
- Zapisuje wartość na szczycie stosu

#### Po Operacji
![Po Operacji ](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/stos/push.png)

### POP (zdjęcie ze stosu)
```assembly
POP BX  ; Pobiera wartość ze stosu do BX
```
- Pobiera wartość ze szczytu stosu
- Zwiększa SP o 2

#### Po Operacji
![Po Operacji ](https://github.com/Pepegakac123/symulacja-rozkazow-procesora-8086/blob/main/public/images/stos/pop.png)


