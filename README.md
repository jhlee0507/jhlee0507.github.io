# jhlee0507.github.io

r3c0n 소개 사이트입니다. GitHub Pages가 푸시할 때마다 자동으로 조립(Jekyll)해서 <https://jhlee0507.github.io/> 에 올립니다.

## 내용을 고치려면

대부분은 `_data/` 폴더의 목록 파일만 고치면 됩니다.

| 바꾸고 싶은 것 | 고칠 파일 |
|---|---|
| CVE 추가·삭제 | `_data/cves.yml` |
| 연구 프로젝트 | `_data/projects.yml` |
| About 목록 | `_data/about.yml` |
| 작은 소개 문장 (메인 화면, About 아래) | `_config.yml`의 `intro` |
| 메뉴 항목 | `_data/nav.yml` (아래 "페이지 추가" 참고) |
| 이름 아래 문구, GitHub 계정, CVE 링크 주소 | `_config.yml` |

### CVE 추가

`_data/cves.yml` 맨 아래에 한 줄을 넣습니다. 메인 화면의 흐르는 줄과 CVE 페이지에 함께 반영됩니다.

```yaml
- id: CVE-2026-12345
```

링크는 기본으로 MSRC 페이지로 연결됩니다. 다른 곳으로 보내려면 `url`과 `source`를 함께 적습니다.

```yaml
- id: CVE-2026-12345
  url: https://example.com/advisory
  source: Vendor
```

### 프로젝트 추가

`_data/projects.yml`에 항목을 넣습니다. `role`은 없어도 됩니다.

```yaml
- title: 프로젝트 이름
  org: 소속
  summary: 한 줄 설명
  role: Project Manager
```

### About 줄 추가

`_data/about.yml`에 항목을 넣습니다. `url`을 빼면 링크 없이 글자만 나옵니다.

```yaml
- label: 링크가 걸릴 글자
  url: https://example.com
  text: 뒤에 이어질 글자
```

목록 아래의 작은 소개 문장은 메인 화면의 이름 아래에도 나옵니다. 두 곳 모두 `_config.yml`의 `intro:` 다음 줄에서 가져오므로 그 줄만 고치면 됩니다. `intro` 두 줄을 지우면 두 곳에서 모두 사라집니다.

### 페이지(메뉴 항목) 추가

메뉴 항목은 페이지와 짝을 이룹니다. `_data/nav.yml`에 항목만 넣으면 없는 페이지로 가는 링크가 됩니다. 예를 들어 Talks 페이지를 만들려면:

1. `about/` 폴더를 복사해 이름을 `talks/`로 바꿉니다.
2. `talks/index.html` 안의 `about`을 모두 `talks`로, `About`을 `Talks`로 바꿉니다. 맨 위의 `key`, `title`과 `id="talks"`가 여기에 해당합니다.
3. `_data/about.yml`과 같은 형식으로 `_data/talks.yml`을 만듭니다.
4. `_data/nav.yml`에 항목을 추가합니다. `key`는 2번의 `key`와 같아야 합니다. 메뉴와 페이지의 번호(01, 02 …)는 이 파일의 순서대로 자동으로 붙습니다.

```yaml
- key: talks
  label: Talks
  url: /talks/
```

페이지를 없앨 때는 폴더와 `nav.yml`의 항목을 함께 지웁니다.

### 적을 때 주의할 점

- 들여쓰기는 스페이스 두 칸입니다. 탭은 쓰지 않습니다.
- 값에 `: `(콜론 뒤 공백)이나 ` #`(공백 뒤 샵)이 들어가면 큰따옴표로 감쌉니다. 예: `summary: "Kernel: bug #3"`
- `<`, `>`, `&` 같은 글자는 그대로 적어도 됩니다. 화면에 글자 그대로 나옵니다.
- 푸시하고 몇 분이 지나도 사이트가 바뀌지 않으면 저장소의 **Actions** 탭에서 실패한 빌드(빨간 X)를 열어 어느 파일 몇 번째 줄이 문제인지 확인합니다.

## 폴더 구조

```
index.html              메인 (이름 영역 + 흐르는 CVE)
about/index.html        About 페이지
projects/index.html     Research Projects 페이지
cve/index.html          CVE 페이지
404.html                없는 주소로 들어왔을 때 보이는 페이지
_layouts/default.html   모든 페이지의 공통 뼈대
_includes/              공통 조각 (메뉴, 이름 영역, 배경 그라데이션, 흐르는 CVE 줄, 페이지 번호)
_data/                  목록 데이터
assets/css/site.css     스타일
assets/js/site.js       세 줄 메뉴 동작, 페이지를 열었을 때 해당 섹션으로 이동
_config.yml             사이트 전체 설정
```

## 내 컴퓨터에서 미리 보기 (선택)

Ruby가 있으면 다음 두 줄로 볼 수 있습니다. 없어도 푸시하면 GitHub가 알아서 조립합니다.

```bash
gem install jekyll -v 3.10.0
```

```bash
jekyll serve
```

저장소 폴더에서 실행한 뒤 브라우저로 <http://localhost:4000> 을 엽니다. `_config.yml`을 고쳤을 때는 껐다가 다시 실행해야 반영됩니다.
