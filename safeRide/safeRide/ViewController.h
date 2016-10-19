//
//  ViewController.h
//  safeRide
//
//  Created by Miguel Oliveira on 18/10/2016.
//  Copyright © 2016 Miguel Oliveira. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

@interface ViewController : UIViewController <CLLocationManagerDelegate>

@property (weak, nonatomic) IBOutlet UISwitch *locationSharingButton;

@end

