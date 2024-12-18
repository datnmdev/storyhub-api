# STORYHUB (API)

## Teamwork và quy trình làm việc

- Developer thực hiện trên nhánh dev.
- Khi viết tính năng mới thì phải tạo nhánh mới dựa trên nhánh dev, nhánh này được đặt tên theo định dạng: feat/tên_tính_năng. VD. Tính năng đăng nhập thì đặt tên là feat/login.
- Khi thực hiện một commit thì phải tuân theo quy ước sau:

  - Dòng đầu tiên không dài quá 80 chữ, luôn bắt đầu bằng động từ, ngắn gọn súc tích.
  - Bỏ trống hai dòng.
  - Sau đó mô tả chi tiết về tính năng đang làm, những điểm cần lưu ý, phần nào của tính năng cần được cải thiện...
  - Thực hiện kèm theo chữ ký signature khi commit bằng git commit -s.
  - VD: git commit -s "
    Add module Authentication

    This module allows users to register/login into our website using
    AWS Cognito account. Added routes:

    - /auth/register
    - /auth/login

    Users after registration will receive a SMS to confirm their account.

    TODO:

    - Implement social identities
    - Add Logout feature
    - Add Forgot password feature"

- Sau khi hoàn thành xong tính năng, developer phải tiến hàng rebase lại nhánh tính năng trước khi merge vào nhánh dev.

### Lưu ý:

- Trên các nhánh feature hãy dùng git rebase -i để làm sạch lịch sử commit trên nhánh trước khi thực hiện merge vào nhánh dev và khi merge phải merge theo kiểu non-fast-forward để tránh lịch sử commit trên nhánh bị nhiễu bằng cách sử dụng lệnh "git merge <tên_nhánh_feature_muốn_gộp> --no-ff"

### Run project

-"npm run dev"

### Create resource new

nest g resource folder_name --no-spec

### Runtime environment: Node.js v19.6.1

### Install package

npm i --save-exact package_name@version

- Install package type definitions
  npm i --save-dev package_name@version

typeorm-model-generator -h localhost -d storyhub -u root -x 123456 -e mysql -p 3307 -o ./src/database