## Architektura procesora 8086
Procesor 8086 to jednostka 16 bitowa, co oznacza, że może przetwarzać dane o długości 16 bitów (czyli dwa bajty) w jednej operacji. Pracuje w architekturze CISC (Complex Instruction Set Computing), co oznacza, że obsługuje złożone zestwy instrukcji, kóre mogą wykonywać rożnorodne zadania w jednym rozazie.

## Rejestry ogólnego przeznaczenia:
- ***AX(Accumulator):*** używany jako akumulator głowny, przechowujący wyniki operacji arytmetycznych, logicznych i przesyłania danych

- ***BX(Base Register):*** Używany w adresowaniu bazowym, gdzie wskazuje podstawowy adres w pamięci.

- ***CX(Counter)***: Służy jako licznik, np. do określania liczby powtórzeń w pętlach.

- ***DX(Data Register)***: Wykorzystywany do przechowywania dodatkowych danych, np: w operacjach mnożenia i dzielenia.

## Rejestry segmentowe
- ***CS(Code Segment):**** Segment kodu, wskazuje miejsce przechowywania kodu programu

- ****DS (Data Segment):**** Segment danych przechowuje dane programu

- ****SS(Stack Segment):**** Segment  stosu, przechowuje stos używany przez PUSH i POP

- ****ES(Extra Semgent):**** Dodatkowy segment, może byc używany do przechowywania danych dodatkowych

## Rejestry wskaźników i indeksów
- ***SP (Stack Pointer) i BP (Base Pointer):*** Służą do operacji na stosie

- ***SI (Source Index) i DI (Destination Index):*** Stosowane w operacjach przesyłania danych, często przy użyciu trybu adresowania indeksowego

## Rejestr flagowy
Przechowuje on informację o stanie procesora po wykonaniu instrukcji. Każdy bit tego rejestru pełni określoną rolę:

- ***CF (Carry Flag):*** Informuje o przeniesieniu lub pożyczce w operacjach arytmetycznych

- ***ZF (Zero Flag):*** Informje, czy wnik operacji wynosi zero.

- ***SF (Sign Flag):*** Określa znak wyniku operacji (dodatni lub ujemny)

- ***OF(Overflow Flag):*** Informuje o przepełnieniu




## Tryby adresowania
W procesorze 8086 dostępne są rożne tryby adresowania, czyli sposoby określania, gdzie przechowywane są dane w pamięci

### Adresowanie Bezpośrednie
W adresowaniu bezpośrednim procesor 8086 odwołuje się do konkretnego adresu w pamięci. Instrukcja zawiera stała wartość offsetu, który mówi procesorowi dokładnie, gdzie ma sięgnąć w pamięci.

```Assembly
MOV AX, [0050h]
```
- Tutaj `AX` zostaje załadowany wartością z pamięci znajdującej sie pod adresem `DS:0050h`
- Jeśli `DS = 2000h`, pełny adres to `20000h + 0050h = 20050h`
- `AX` pobiera zawartość z tego adresu

### Adresowanie Rejestrowe
W adresowaniu rejestrowym operujemy wyłącznie na rejestrach, co oznacza że dane nie są pobierane ani zapisywane do pamięci, ale przetwarzane bezpośrednio w rejestrach procesora.
```Assembly
MOV AX, BX
```
- W tym przypadku `AX` przyjmuje wartość `BX`
- Jeśli `BX = 1234h`, to po wykonaniu `AX = 1234h`
- Ta operacja jest szybka, poniewaz odbywa się wyłącznie na rejestrach bez dostępu do pamięci

