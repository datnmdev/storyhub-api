import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';

@EventSubscriber()
export class DateSubscriber implements EntitySubscriberInterface<any> {
  // Khi load (lấy dữ liệu từ DB), chuyển đổi Date thành chuỗi ISO 8601
  afterLoad(entity: any) {
    Object.keys(entity).forEach((key) => {
      if (entity[key] instanceof Date) {
        // Chuyển Date thành ISO 8601 (chuỗi)
        entity[key] = entity[key].toISOString().split('T')[0];
      }
    });
  }
}
